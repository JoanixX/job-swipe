from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.infraestructure.database.base import Base


class PasswordResetTokenModel(Base):
    __tablename__ = "password_reset_token"

    id = Column(Integer, primary_key=True, )

    user_id = Column(Integer, ForeignKey("app_user.id"), nullable=False, index=True, )

    # Se almacena solo el hash SHA-256 del token, nunca el token en claro
    token_hash = Column(String(64), unique=True, nullable=False, )

    expires_at = Column(DateTime, nullable=False, )

    used_at = Column(DateTime, nullable=True, )

    created_at = Column(DateTime, nullable=False, server_default=func.now(), )
