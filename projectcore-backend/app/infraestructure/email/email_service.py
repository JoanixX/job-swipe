import asyncio
import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)

# Config por variables de entorno. Si SMTP_HOST no está configurado,
# el servicio loggea el enlace en vez de enviar (modo desarrollo).
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "no-reply@jobswipe.com")

RESET_EMAIL_TEMPLATE = """\
<!DOCTYPE html>
<html lang="es">
<body style="margin:0; padding:0; background-color:#F3F4F6; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A, #6366F1); background-color:#1E3A8A; padding: 28px 32px; text-align: center;">
              <span style="color:#ffffff; font-size: 26px; font-weight: 800;">JobSwipe</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="color:#111827; font-size: 20px; margin: 0 0 12px;">Hola {user_name},</h1>
              <p style="color:#4B5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                Haz clic en el botón para crear una nueva contraseña:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="{reset_link}"
                       style="background: linear-gradient(90deg, #1E3A8A, #6366F1); background-color:#1E3A8A; color:#ffffff; text-decoration:none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; display: inline-block;">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#6B7280; font-size: 12px; line-height: 1.6; margin: 0 0 8px;">
                Este enlace expira en {expire_minutes} minutos y solo puede usarse una vez.
              </p>
              <p style="color:#6B7280; font-size: 12px; line-height: 1.6; margin: 0;">
                Si no solicitaste este cambio, puedes ignorar este correo: tu contraseña seguirá siendo la misma.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F9FAFB; padding: 16px 32px; text-align: center;">
              <span style="color:#9CA3AF; font-size: 11px;">© JobSwipe — Conectando talento universitario con las empresas del futuro</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def _send_email_sync(to_email: str, subject: str, html_body: str, ) -> None:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message.set_content("Tu cliente de correo no soporta HTML. Abre el enlace de recuperación desde otro dispositivo.")
    message.add_alternative(html_body, subtype="html")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls()

        if SMTP_USER:
            server.login(SMTP_USER, SMTP_PASSWORD)

        server.send_message(message)


async def send_password_reset_email(to_email: str, user_name: str, reset_link: str, expire_minutes: int, ) -> None:
    html_body = RESET_EMAIL_TEMPLATE.format(
        user_name=user_name or "usuario",
        reset_link=reset_link,
        expire_minutes=expire_minutes,
    )

    if not SMTP_HOST:
        logger.warning(
            "SMTP no configurado (SMTP_HOST vacío). Enlace de recuperación para %s: %s",
            to_email,
            reset_link,
        )
        return

    # smtplib es bloqueante: se ejecuta en un hilo para no frenar el event loop
    await asyncio.to_thread(_send_email_sync, to_email, "Recupera tu contraseña de JobSwipe", html_body, )
