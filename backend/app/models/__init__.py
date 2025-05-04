from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, TypeVar
from uuid import uuid4

from sqlalchemy import DateTime, String, and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

T = TypeVar("T", bound="BaseModel")


class BaseModel(Base):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid4())
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def model_dump(self) -> dict[str, Any]:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @classmethod
    async def get(cls: type[T], db: AsyncSession, **filters: Any) -> T | None:
        query = select(cls)
        for attr, value in filters.items():
            if hasattr(cls, attr):
                query = query.where(getattr(cls, attr) == value)

        result = await db.execute(query)
        return result.scalar_one_or_none()

    @classmethod
    async def get_all(
        cls: type[T],
        db: AsyncSession,
        page: int = 1,
        size: int = 100,
        sort_by: Optional[str] = None,
        descending: bool = False,
        use_or: bool = True,
        filters: Optional[Dict[str, Any]] = None,
        search: Optional[str] = None,
    ) -> tuple[List[T], int]:
        skip = (page - 1) * size
        query = select(cls)
        conditions: List[Any] = []

        if filters:
            filter_conditions: List[Any] = []
            for attr, value in filters.items():
                if hasattr(cls, attr):
                    filter_conditions.append(getattr(cls, attr) == value)
                else:
                    raise ValueError(f"Invalid filter attribute: {attr}")
            if filter_conditions:
                conditions.append(
                    or_(*filter_conditions) if use_or else and_(*filter_conditions)
                )

        if search:
            search_fields = getattr(cls, "SEARCH_FIELDS", [])
            if search_fields:
                search_conditions: List[Any] = []
                for field in search_fields:
                    if hasattr(cls, field):
                        search_conditions.append(
                            getattr(cls, field).ilike(f"%{search}%")
                        )
                    else:
                        raise ValueError(f"Invalid search field: {field}")
                if search_conditions:
                    conditions.append(or_(*search_conditions))

        if conditions:
            for condition in conditions:
                query = query.where(condition)

        # Count total before pagination
        count_query = (
            select(cls).where(*query.whereclause.clauses)
            if query.whereclause is not None
            else select(cls)
        )
        count_result = await db.execute(
            select(func.count()).select_from(count_query.subquery())
        )
        total = count_result.scalar_one()

        if sort_by:
            if not hasattr(cls, sort_by):
                raise ValueError(f"Invalid sort attribute: {sort_by}")
            order_attr = getattr(cls, sort_by)
            query = query.order_by(order_attr.desc() if descending else order_attr)

        query = query.offset(skip).limit(size)
        result = await db.execute(query)
        data = list(result.scalars().all())

        return (data, total)

    async def save(self: T, db: AsyncSession) -> T:
        if not self.id:
            db.add(self)
        await db.commit()
        await db.refresh(self)
        return self

    async def delete(self, db: AsyncSession) -> bool:
        await db.delete(self)
        await db.commit()
        return True
