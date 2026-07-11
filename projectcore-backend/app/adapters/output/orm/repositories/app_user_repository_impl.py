from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.app_user_model import AppUserModel
from app.domain.entities.app_user import AppUser, UserRole
from app.domain.repositories.app_user_repository import AppUserRepository


class AppUserRepositoryImpl(AppUserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _active_filter():
        return AppUserModel.deleted_at.is_(None)

    @staticmethod
    def _to_domain(model: AppUserModel) -> AppUser:
        role_value = model.role.value if hasattr(model.role, "value") else model.role

        return AppUser(id=model.id, email=model.email, dni=model.dni, password_hash=model.password_hash,
                       role=UserRole(role_value), related_id=model.related_id, created_at=model.created_at,
                       updated_at=model.updated_at, deleted_at=model.deleted_at, cv_url=model.cv_url, name=model.name,
                       location=model.location, ruc=model.ruc, date_of_birth=model.date_of_birth,
                       main_motivation=model.main_motivation, description=model.description, phone=model.phone,
                       linkedin=model.linkedin, portfolio=model.portfolio, )

    async def find_by_email(self, email: str) -> AppUser | None:
        statement = select(AppUserModel).where(AppUserModel.email == email, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        return self._to_domain(model)

    async def save(self, user: AppUser) -> AppUser:
        model = AppUserModel(email=user.email, dni=user.dni, password_hash=user.password_hash,
                             role=user.role.value if isinstance(user.role, UserRole) else user.role,
                             related_id=user.related_id,
                             cv_url=user.cv_url, name=user.name, location=user.location, ruc=user.ruc,
                             date_of_birth=user.date_of_birth,
                             main_motivation=user.main_motivation, description=user.description, phone=user.phone,
                             linkedin=user.linkedin, portfolio=user.portfolio, deleted_at=user.deleted_at, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_domain(model)

    async def get_by_id(self, user_id: int) -> AppUser | None:
        statement = select(AppUserModel).where(AppUserModel.id == user_id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        return self._to_domain(model)

    async def update(self, user_id: int, updates: dict[str, Any]) -> AppUser | None:
        statement = select(AppUserModel).where(AppUserModel.id == user_id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        allowed_fields = {"name", "location", "phone", "linkedin", "portfolio", "cv_url", "date_of_birth",
                          "main_motivation", "description", "password_hash", }

        for field, value in updates.items():
            if field in allowed_fields:
                setattr(model, field, value)

        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_domain(model)

    async def delete(self, user_id: int) -> bool:
        statement = select(AppUserModel).where(AppUserModel.id == user_id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return False

        model.deleted_at = datetime.utcnow()
        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True
