from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.company_model import CompanyModel
from app.domain.entities.company import Company
from app.domain.repositories.company_repository import CompanyRepository


class CompanyRepositoryImpl(CompanyRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _active_filter():
        return CompanyModel.deleted_at.is_(None)

    @staticmethod
    def _to_entity(model: CompanyModel) -> Company:
        return Company(
            id=model.id,
            name=model.name,
            industry=model.industry,
            company_culture=model.company_culture,
            contact_email=model.contact_email,
            phone=model.phone,
            website=model.website,
            location=model.location,
            created_at=model.created_at,
            updated_at=model.updated_at,
            deleted_at=model.deleted_at,
        )

    async def save(self, company: Company) -> Company:
        now = datetime.utcnow()

        model = CompanyModel(
            name=company.name,
            industry=company.industry,
            company_culture=company.company_culture,
            contact_email=company.contact_email,
            phone=company.phone,
            website=company.website,
            location=company.location,
            created_at=company.created_at or now,
            updated_at=company.updated_at or now,
            deleted_at=company.deleted_at,
        )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(
            self,
            company_id: int,
    ) -> Optional[Company]:
        statement = select(CompanyModel).where(
            CompanyModel.id == company_id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        return self._to_entity(model)

    async def get_all(self) -> list[Company]:
        statement = (
            select(CompanyModel)
            .where(self._active_filter())
            .order_by(CompanyModel.created_at.desc())
        )

        result = await self.session.execute(statement)
        models = result.scalars().all()

        return [
            self._to_entity(model)
            for model in models
        ]

    async def update(
            self,
            company: Company,
    ) -> Optional[Company]:
        statement = select(CompanyModel).where(
            CompanyModel.id == company.id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.name = company.name
        model.industry = company.industry
        model.company_culture = company.company_culture
        model.contact_email = company.contact_email
        model.phone = company.phone
        model.website = company.website
        model.location = company.location
        model.updated_at = company.updated_at or datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(self, company_id: int) -> bool:
        statement = select(CompanyModel).where(
            CompanyModel.id == company_id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return False

        now = datetime.utcnow()
        model.deleted_at = now
        model.updated_at = now

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True