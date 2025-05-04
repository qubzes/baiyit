from typing import Annotated, Awaitable, Callable

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from permit import Permit
from permit.api.models import RoleAssignmentCreate, UserCreate
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security.jwt import verify_token
from app.models.user import User

permit = Permit(
    pdp=settings.PERMIT_PDP_URL,
    token=settings.PERMIT_API_KEY,
)

security = HTTPBearer()


async def get_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Security(security)],
    db: AsyncSession = Depends(get_db),
) -> User:
    """ """
    token = credentials.credentials
    return await verify_token(db, token)


async def sync_user(user: User) -> None:
    """Syncs user information with Permit."""
    await permit.api.users.sync(  # type: ignore
        UserCreate(
            key=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )
    )


async def assign_role(user_id: str, role: str) -> None:
    await permit.api.users.assign_role(
        RoleAssignmentCreate(
            user=user_id,
            role=role,
            tenant="default",
        )
    )


async def check_permission(
    user_id: str,
    action: str,
    resource: str,
) -> bool:
    """Checks if the user has permission to perform the action on the resource."""
    allowed = await permit.check(  # type: ignore
        user_id,
        action,
        {
            "type": resource,
        },
    )
    if not allowed:
        raise HTTPException(
            status_code=403,
            detail=f"You do not have permission to perform {action} action on {resource}",
        )
    return allowed


def has_permission(action: str, resource: str) -> Callable[[User], Awaitable[User]]:
    """Returns a dependency function that checks if the user has permission to perform the action on the resource."""

    async def permission_dependency(
        user: Annotated[User, Depends(get_user)],
    ) -> User:
        await check_permission(user.id, action, resource)
        return user

    return permission_dependency
