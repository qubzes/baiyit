from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import assign_role, get_user, security, sync_user
from app.core.security.jwt import (
    generate_tokens,
    regenerate_tokens,
    revoke_token,
)
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    RefreshToken,
    RequestOTP,
    VerifyOTP,
)
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register")
async def register(
    user_data: UserCreate, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Create a new user account"""
    try:
        if await User.get(db, email=user_data.email):
            raise HTTPException(
                status_code=400,
                detail="An account with this email address already exists. Please use a different email or try to sign in.",
            )

        user = User(**user_data.model_dump())
        user.send_otp(is_new=True)
        await user.save(db)
        await sync_user(user)
        await assign_role(user.id, user.role.value)

        return UserResponse(**user.model_dump())
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/request-otp")
async def request_otp(
    data: RequestOTP, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Request a new OTP for authentication"""
    try:
        user = await User.get(db, email=data.email)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email address. Please check the email or register a new account.",
            )

        user.send_otp()
        await user.save(db)

        return UserResponse(**user.model_dump())
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify-otp")
async def verify_otp(
    data: VerifyOTP, db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    """Verify OTP and authenticate user"""
    try:
        user = await User.get(db, email=data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not user.verify_otp(data.otp):
            raise HTTPException(
                status_code=401,
                detail="The verification code you entered is incorrect or has expired. Please try again or request a new code.",
            )

        if user.is_suspended:
            raise HTTPException(
                status_code=401,
                detail="Your account has been suspended. Please contact our support team at support@baiyit.com for assistance.",
            )

        await user.save(db)

        auth = await generate_tokens(db, user.id)
        return AuthResponse(**auth.model_dump(), user=UserResponse(**user.model_dump()))
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
async def get_current_user(
    user: User = Depends(get_user),
) -> UserResponse:
    """Get current authenticated user"""
    try:
        return UserResponse(**user.model_dump())
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_token(
    data: RefreshToken, db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    """Refresh access token"""
    try:
        user, auth = await regenerate_tokens(db, data.refresh_token)
        return AuthResponse(**auth.model_dump(), user=UserResponse(**user.model_dump()))
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sign-out")
async def sign_out(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Sign out a user by revoking their token"""
    try:
        token = credentials.credentials
        await revoke_token(db, token)
        return {"message": "Successfully signed out"}
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
