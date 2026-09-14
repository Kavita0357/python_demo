import aiosmtplib

from email.message import EmailMessage

from app.core.config import settings


async def send_password_reset_email(
    email: str,
    reset_token: str,
):
    reset_link = f"{settings.FRONTEND_URL}/reset-password" f"?token={reset_token}"

    message = EmailMessage()

    message["From"] = f"{settings.SMTP_FROM_NAME} " f"<{settings.SMTP_FROM_EMAIL}>"
    message["To"] = email
    message["Subject"] = "Reset your password"

    message.set_content(f"""
Hello,

We received a request to reset your password.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
{settings.SMTP_FROM_NAME}
""")

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        start_tls=True,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
    )
