from typing import Any, List

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "Baiyit API"
    APP_VERSION: str = "0.1.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] | str = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]
    FRONTEND_URL: str = "http://localhost:3000"

    # JWT Settings
    SECRET_KEY: str = "S3cur3P@ssw0rd!2025"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database Settings
    POSTGRES_SERVER: str = "postgres"
    POSTGRES_USER: str = "baiyit"
    POSTGRES_PASSWORD: str = "S3cur3P4ssw0rd"
    POSTGRES_DB: str = "baiyit"

    # Redis Settings
    REDIS_URL: str = "redis://redis:6379/0"

    # Permit Settings
    PERMIT_API_KEY: str = "permit_key_4pi-k3y"
    PERMIT_PDP_URL: str = "https://cloudpdp.api.permit.io"

    # Mail Settings
    MAIL_USERNAME: str = "no-reply@baiyit.com"
    MAIL_PASSWORD: str = "S3cur3M4!lP@ssw0rd"
    MAIL_FROM_NAME: str = "Baiyit"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "mail.baiyit.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL: bool = False

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> List[str] | Any:
        if isinstance(v, str):
            return [url.strip() for url in v.split(",")]
        return v

    def _build_database_url(self, scheme: str) -> str:
        return str(
            PostgresDsn.build(
                scheme=scheme,
                username=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD,
                host=self.POSTGRES_SERVER,
                path=self.POSTGRES_DB,
            )
        )

    @property
    def DATABASE_URL(self) -> str:
        return self._build_database_url("postgresql+asyncpg")

    @property
    def SYNC_DATABASE_URL(self) -> str:
        return self._build_database_url("postgresql")

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"

    class Config:
        env_file = ".env"


settings = Settings()
