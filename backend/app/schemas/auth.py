from pydantic import EmailStr

from app.schemas import BaseRequest, BaseResponse
from app.schemas.user import UserResponse


class RequestOTP(BaseRequest):
    email: EmailStr


class VerifyOTP(BaseRequest):
    email: EmailStr
    otp: str


class Auth(BaseResponse):
    token_type: str = "Bearer"
    access_token: str
    expires_at: int
    refresh_token: str
    refresh_token_expires_at: int


class AuthResponse(Auth):
    user: UserResponse


class RefreshToken(BaseRequest):
    refresh_token: str
