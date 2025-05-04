import enum
import random
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.email import send_email
from app.models import BaseModel


class UserRole(enum.Enum):
    customer = "customer"
    admin = "admin"


class User(BaseModel):
    __tablename__ = "users"

    first_name: Mapped[str] = mapped_column(String(30), nullable=False)
    last_name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    phone: Mapped[Optional[str]] = mapped_column(
        String(20), unique=False, nullable=True
    )
    avatar: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole), nullable=False, default=UserRole.customer
    )
    is_suspended: Mapped[bool] = mapped_column(Boolean, default=False)
    otp: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    otp_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    SEARCH_FIELDS = ["email", "first_name", "last_name"]

    def send_otp(self, is_new: bool = False) -> None:
        """Send OTP Email for registration or sign in"""

        otp = "".join(random.choices("0123456789", k=6))
        print("OTP: ", otp)

        self.otp = otp
        self.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

        if is_new:
            subject = "Welcome to Our Platform - Verify Your Account"
            template_name = "registration.mjml"
        else:
            subject = "Your OTP Code for Authentication"
            template_name = "sign-in.mjml"

        send_email(
            subject=subject,
            email=self.email,
            template_name=template_name,
            context={
                "first_name": self.first_name,
                "otp": otp,
            },
        )

    def verify_otp(self, submitted_otp: str) -> bool:
        """Verify the submitted OTP against the stored OTP"""
        now = datetime.now(timezone.utc)

        if (
            self.otp is not None
            and self.otp_expires_at is not None
            and now < self.otp_expires_at
            and self.otp == submitted_otp
        ):
            self.otp = None
            self.otp_expires_at = None
            return True

        return False
