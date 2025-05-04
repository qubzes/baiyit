from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.auth_session import AuthSession
from app.models.user import User
from app.schemas.auth import Auth


class TokenData(BaseModel):
    user_id: str
    exp: datetime
    token_type: str


def create_token(user_id: str, token_type: str = "access") -> str:
    """Create a new JWT token"""
    expire = datetime.now(timezone.utc) + (
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        if token_type == "access"
        else timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    token_data = TokenData(user_id=user_id, exp=expire, token_type=token_type)
    return str(
        jwt.encode(token_data.model_dump(), settings.SECRET_KEY, algorithm="HS256")  # type: ignore
    )


async def verify_token(
    db: AsyncSession, token: str, token_type: str = "access"
) -> User:
    """Verify token and return user_id if valid"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])  # type: ignore
        if payload["token_type"] != token_type:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid token type. Expected {token_type} token.",
            )

        user_id = payload["user_id"]

        if token_type == "access":
            auth_session = await AuthSession.get(
                db, access_token=token, user_id=user_id
            )
        else:
            auth_session = await AuthSession.get(
                db, refresh_token=token, user_id=user_id
            )

        if not auth_session:
            raise HTTPException(
                status_code=401,
                detail="Authentication session not found. Please sign in again.",
            )

        user = await User.get(db, id=user_id)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="User account not found. Please contact support.",
            )

        if user.is_suspended:
            raise HTTPException(
                status_code=401,
                detail="Your account has been suspended. Please contact our support team at support@baiyit.com for assistance.",
            )

        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Your session has expired. Please log in again."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication token. Please log in again."
        )


async def generate_tokens(db: AsyncSession, user_id: str) -> Auth:
    """Generate new access and refresh tokens"""
    access_token = create_token(user_id, "access")
    refresh_token = create_token(user_id, "refresh")

    auth = AuthSession(
        access_token=access_token, refresh_token=refresh_token, user_id=user_id
    )
    await auth.save(db)

    return Auth(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=int(
            (
                datetime.now(timezone.utc)
                + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            ).timestamp()
        ),
        refresh_token_expires_at=int(
            (
                datetime.now(timezone.utc)
                + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            ).timestamp()
        ),
    )


async def regenerate_tokens(db: AsyncSession, refresh_token: str) -> tuple[User, Auth]:
    """Regenerate tokens using refresh token"""
    user = await verify_token(db, refresh_token, "refresh")

    auth = await AuthSession.get(db, refresh_token=refresh_token, user_id=user.id)
    if not auth:
        raise HTTPException(
            status_code=401, detail="Invalid refresh token. Please sign in again."
        )

    access_token = create_token(user.id, "access")
    refresh_token = create_token(user.id, "refresh")

    auth.access_token = access_token
    auth.refresh_token = refresh_token
    await auth.save(db)

    auth_response = Auth(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=int(
            (
                datetime.now(timezone.utc)
                + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            ).timestamp()
        ),
        refresh_token_expires_at=int(
            (
                datetime.now(timezone.utc)
                + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            ).timestamp()
        ),
    )

    return user, auth_response


async def revoke_token(db: AsyncSession, token: str) -> None:
    """Revoke token"""
    auth = await AuthSession.get(db, access_token=token)
    if auth:
        await auth.delete(db)
    else:
        raise HTTPException(
            status_code=401, detail="Cannot sign out: Invalid or expired session."
        )
