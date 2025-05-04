from datetime import datetime
from typing import Optional

from pydantic import EmailStr

from app.models.user import UserRole
from app.schemas import BaseRequest, BaseResponse, PaginatedRequest


class UserResponse(BaseResponse):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    avatar: str | None
    role: UserRole
    is_suspended: bool
    created_at: datetime
    updated_at: datetime


class UserCreate(BaseRequest):
    email: EmailStr
    first_name: str
    last_name: str


class UserUpdate(BaseResponse):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    avatar: str | None = None


class UserPaginatedRequest(PaginatedRequest):
    role: Optional[UserRole] = None
    is_suspended: Optional[bool] = None
