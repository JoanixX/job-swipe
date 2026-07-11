from datetime import datetime
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.repositories.app_user_repository_impl import (AppUserRepositoryImpl, )
from app.application.ports.app_user_port import AppUserPort
from app.domain.entities.app_user import AppUser, UserRole


class AppUserPortImpl(AppUserPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.app_user_repo = AppUserRepositoryImpl(session)

    async def get_by_email(self, email: str) -> Optional[AppUser]:
        return await self.app_user_repo.find_by_email(email)

    async def register_user(self, user_data: dict[str, Any]) -> AppUser:
        now = datetime.utcnow()

        role = user_data.get("role", UserRole.student)
        if isinstance(role, str):
            role = UserRole(role)

        app_user = AppUser(id=0, email=user_data["email"], dni=user_data["dni"],
                           password_hash=user_data["password_hash"], role=role, related_id=user_data["related_id"],
                           created_at=user_data.get("created_at", now), updated_at=user_data.get("updated_at", now),
                           deleted_at=user_data.get("deleted_at"), cv_url=user_data.get("cv_url"),
                           name=user_data.get("name"),
                           location=user_data.get("location"), ruc=user_data.get("ruc"),
                           date_of_birth=user_data.get("date_of_birth"),
                           main_motivation=user_data.get("main_motivation"), description=user_data.get("description"),
                           phone=user_data.get("phone"), linkedin=user_data.get("linkedin"),
                           portfolio=user_data.get("portfolio"), )

        return await self.app_user_repo.save(app_user)

    async def get_by_id(self, user_id: int) -> Optional[AppUser]:
        return await self.app_user_repo.get_by_id(user_id)

    async def update(self, user_id: int, updates: dict[str, Any], ) -> Optional[AppUser]:
        return await self.app_user_repo.update(user_id, updates)

    async def delete(self, user_id: int) -> bool:
        return await self.app_user_repo.delete(user_id)
