from typing import List, Optional

from sqlalchemy import ARRAY, Boolean, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models import BaseModel


class Product(BaseModel):
    __tablename__ = "products"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    original_price: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True
    )
    discount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    image: Mapped[str] = mapped_column(String, nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    specs: Mapped[Optional[List[str]]] = mapped_column(
        ARRAY(String), nullable=True
    )

    SEARCH_FIELDS = ["title", "description", "category"]
