from pathlib import Path
from typing import Dict

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from fastapi_mail.schemas import MessageType
from mjml import mjml_to_html
from pydantic import SecretStr
from pystache import render

from app.core.config import settings
from app.core.redis import email_queue

TEMPLATE_FOLDER = Path(__file__).parent.parent / "emails"

email_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=SecretStr(settings.MAIL_PASSWORD),
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
)
fm = FastMail(email_config)


def send_email(
    subject: str, email: str, template_name: str, context: Dict[str, str] = {}
) -> None:
    """Send email using MJML template"""
    template_path = TEMPLATE_FOLDER / template_name
    with open(template_path, "r") as f:
        template_content = f.read()
        mjml_result = mjml_to_html(template_content)
        html_content = render(mjml_result.html, context)  # type: ignore

    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=html_content,
        subtype=MessageType.html,
    )
    email_queue.enqueue(fm.send_message, message=message)  # type: ignore
