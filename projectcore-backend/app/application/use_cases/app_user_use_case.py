import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta
from typing import Any

from app.adapters.output.orm.models.company_model import CompanyModel
from app.adapters.output.orm.models.student_model import StudentModel
from app.application.ports.app_user_port import AppUserPort
from app.core.security.jwt_utils import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.domain.entities.app_user import AppUser
from app.domain.services.app_user_service import AppUserService
from app.infraestructure.email.email_service import send_password_reset_email

logger = logging.getLogger(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))

# Respuesta genérica: no revela si el correo existe o no
RECOVER_GENERIC_RESPONSE = {
    "success": True,
    "message": "Si el correo está registrado, recibirás un enlace de recuperación",
}


class AppUserUseCase:
    def __init__(
            self,
            user_port: AppUserPort,
            service: AppUserService,
            reset_token_repo=None,
    ):
        self.user_port = user_port
        self.user_service = service
        self.reset_token_repo = reset_token_repo

    async def get_user_by_email(self, email: str) -> AppUser:
        user = await self.user_port.get_by_email(email)

        if user is None:
            raise ValueError("Usuario no encontrado")

        return user

    async def register_user(self, user_data: dict[str, Any]) -> dict[str, Any]:
        existing_user = await self.user_port.get_by_email(user_data["email"])

        if existing_user is not None:
            raise ValueError("El email ya está registrado")

        password = user_data.pop("password", None)

        if password is not None:
            if len(password) < 8:
                raise ValueError(
                    "La contraseña debe tener al menos 8 caracteres"
                )

            user_data["password_hash"] = get_password_hash(password)

        if not user_data.get("password_hash"):
            raise ValueError("Se requiere el campo password")

        user_id = await self.user_service.register_user(user_data)

        if not user_id:
            raise ValueError("Error al guardar el usuario")

        return {
            "user_id": user_id,
            "registration_success": True,
            "message": "Usuario registrado exitosamente",
        }

    async def login(
            self,
            email: str,
            password: str,
            session,
    ) -> dict[str, Any]:
        user = await self.user_service.authenticate(
            email,
            password,
            session,
        )

        if user is None:
            raise ValueError("Credenciales incorrectas")

        role_value = (
            user.role.value
            if hasattr(user.role, "value")
            else user.role
        )

        extra: dict[str, Any] = {}

        if role_value == "company":
            company = await session.get(CompanyModel, user.related_id)

            if company is not None:
                extra = {
                    "company_id": company.id,
                    "company_name": company.name,
                }

        elif role_value == "student":
            student = await session.get(StudentModel, user.related_id)

            if student is not None:
                extra = {
                    "student_id": student.id,
                    "student_name": user.name,
                }

        access_token = create_access_token(
            {
                "sub": user.email,
                "role": role_value,
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": role_value,
            **extra,
        }

    async def update_user(
            self,
            user_id: int,
            updates: dict[str, Any],
    ) -> AppUser:
        if not updates:
            raise ValueError("No se recibieron campos para actualizar")

        allowed_fields = {
            "name",
            "location",
            "phone",
            "linkedin",
            "portfolio",
            "cv_url",
            "date_of_birth",
            "main_motivation",
            "description",
        }

        invalid_fields = set(updates) - allowed_fields

        if invalid_fields:
            raise ValueError(
                "Campos no permitidos: "
                + ", ".join(sorted(invalid_fields))
            )

        updated_user = await self.user_port.update(
            user_id,
            updates,
        )

        if updated_user is None:
            raise ValueError("Usuario no encontrado")

        return updated_user

    async def update_password(
            self,
            user_id: int,
            current_password: str,
            new_password: str,
            session,
    ) -> dict[str, Any]:
        if not current_password:
            raise ValueError("La contraseña actual es obligatoria")

        if not new_password or len(new_password) < 8:
            raise ValueError(
                "La nueva contraseña debe tener al menos 8 caracteres"
            )

        user = await self.user_port.get_by_id(user_id)

        if user is None:
            raise ValueError("Usuario no encontrado")

        try:
            password_is_valid = verify_password(
                current_password,
                user.password_hash,
            )
        except Exception as error:
            raise ValueError(
                "El formato de la contraseña almacenada no es válido"
            ) from error

        if not password_is_valid:
            raise ValueError("La contraseña actual es incorrecta")

        updated_user = await self.user_port.update(
            user_id,
            {
                "password_hash": get_password_hash(new_password),
            },
        )

        if updated_user is None:
            raise ValueError("Error al actualizar la contraseña")

        return {
            "success": True,
            "message": "Contraseña actualizada correctamente",
        }

    async def recover_password(self, email: str) -> dict[str, Any]:
        if self.reset_token_repo is None:
            raise ValueError("Recuperación de contraseña no disponible")

        user = await self.user_port.get_by_email(email)

        if user is None:
            # Mismo mensaje que el caso exitoso para no revelar si el correo existe
            return RECOVER_GENERIC_RESPONSE

        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)

        # Los tokens previos quedan inservibles: solo el último enlace es válido
        await self.reset_token_repo.invalidate_for_user(user.id)
        await self.reset_token_repo.save(user.id, token_hash, expires_at)

        reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

        try:
            await send_password_reset_email(
                to_email=user.email,
                user_name=user.name,
                reset_link=reset_link,
                expire_minutes=RESET_TOKEN_EXPIRE_MINUTES,
            )
        except Exception:
            logger.error("Error al enviar el correo de recuperación", exc_info=True)

        return RECOVER_GENERIC_RESPONSE

    async def reset_password(self, token: str, new_password: str) -> dict[str, Any]:
        if self.reset_token_repo is None:
            raise ValueError("Recuperación de contraseña no disponible")

        if not new_password or len(new_password) < 8:
            raise ValueError(
                "La nueva contraseña debe tener al menos 8 caracteres"
            )

        token_hash = hashlib.sha256(token.encode()).hexdigest()
        token_record = await self.reset_token_repo.find_valid_by_token_hash(token_hash)

        if token_record is None:
            raise ValueError("El enlace de recuperación es inválido o ha expirado")

        await self.reset_token_repo.mark_used(token_record.id)

        updated_user = await self.user_port.update(
            token_record.user_id,
            {
                "password_hash": get_password_hash(new_password),
            },
        )

        if updated_user is None:
            raise ValueError("Usuario no encontrado")

        return {
            "success": True,
            "message": "Contraseña actualizada correctamente",
        }

    async def delete_account(self, user_id: int) -> dict[str, Any]:
        user = await self.user_port.get_by_id(user_id)

        if user is None:
            raise ValueError("Usuario no encontrado")

        deleted = await self.user_port.delete(user_id)

        if not deleted:
            raise ValueError("Error al eliminar la cuenta")

        return {
            "success": True,
            "message": "Cuenta eliminada correctamente",
        }
