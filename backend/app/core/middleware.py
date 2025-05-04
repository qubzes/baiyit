from typing import Annotated, Literal

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from permit import Permit
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security.jwt import verify_token
from app.models.user import User, UserRole

permit = Permit(
    pdp=settings.PERMIT_PDP_URL,
    token=settings.PERMIT_API_KEY,
)

security = HTTPBearer()


async def get_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Security(security)],
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    return await verify_token(db, token)


async def user_is_admin(
    current_user: Annotated[User, Depends(get_user  )],
) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Only admins have access")
    return current_user


async def check_permission(action: str, resource: str, user: str) -> Literal[True]:
    """ Checks if a user is authorized to perform a specific action on a resource. """
    try:
        allowed = await permit.check(
            user,
            action,
            {
                "type": resource,
            },
        )
        if not allowed:
            raise HTTPException(
                status_code=403, detail="Forbidden: Not allowed"
            )
        return True
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Authorization error: {str(e)}"
        )
