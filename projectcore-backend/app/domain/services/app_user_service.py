from datetime import date, datetime
from typing import Any, Optional

from app.domain.entities.app_user import AppUser, UserRole
from app.domain.repositories.app_user_repository import AppUserRepository


class AppUserService:
    def __init__(self, user_repo: AppUserRepository):
        self.user_repo = user_repo

    async def get_by_email(self, email: str) -> Optional[AppUser]:
        return await self.user_repo.find_by_email(email)

    async def register_user(self, user_data: dict[str, Any]) -> int:
        user = self.app_user_entity(user_data)
        saved_user = await self.user_repo.save(user)

        if saved_user is None:
            raise ValueError("Error al guardar el usuario")

        return saved_user.id

    async def authenticate(self, email: str, password: str, session=None, ) -> Optional[AppUser]:
        user = await self.user_repo.find_by_email(email)

        if user is None:
            return None

        from app.core.security.jwt_utils import verify_password

        try:
            password_is_valid = verify_password(password, user.password_hash, )
        except Exception:
            return None

        if not password_is_valid:
            return None

        return user

    def app_user_entity(self, user_data: dict[str, Any]) -> AppUser:
        now = datetime.utcnow()

        role = user_data.get("role", UserRole.student)
        if isinstance(role, str):
            role = UserRole(role)

        date_of_birth = user_data.get("date_of_birth")

        if isinstance(date_of_birth, str):
            try:
                date_of_birth = date.fromisoformat(date_of_birth)
            except ValueError as error:
                raise ValueError("date_of_birth debe tener un formato válido") from error

        return AppUser(id=0, email=user_data["email"], dni=user_data["dni"], password_hash=user_data["password_hash"],
                       role=role, related_id=user_data["related_id"], created_at=user_data.get("created_at", now),
                       updated_at=user_data.get("updated_at", now), deleted_at=user_data.get("deleted_at"),
                       cv_url=user_data.get("cv_url"), name=user_data.get("name"), location=user_data.get("location"),
                       ruc=user_data.get("ruc"), date_of_birth=date_of_birth,
                       main_motivation=user_data.get("main_motivation"),
                       description=user_data.get("description"), phone=user_data.get("phone"),
                       linkedin=user_data.get("linkedin"),
                       portfolio=user_data.get("portfolio"), )
