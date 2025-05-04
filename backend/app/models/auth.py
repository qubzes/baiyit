from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import BaseModel
from app.models.user import User


class Auth(BaseModel):
    __tablename__ = "auth_sessions"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    access_token: Mapped[str] = mapped_column(String(500), nullable=False)
    refresh_token: Mapped[str] = mapped_column(String(500), nullable=False)

    user: Mapped[User] = relationship(User, back_populates="auth_sessions")
