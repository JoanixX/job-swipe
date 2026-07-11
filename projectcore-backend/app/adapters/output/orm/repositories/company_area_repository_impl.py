from typing import List

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.company_area_model import CompanyAreaModel
from app.domain.entities.company_area import CompanyArea
from app.domain.repositories.company_area_repository import (
    CompanyAreaRepository,
)


class CompanyAreaRepositoryImpl(CompanyAreaRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: CompanyAreaModel) -> CompanyArea:
        return CompanyArea(
            company_id=model.company_id,
            area_id=model.area_id,
        )

    async def get_by_company_id(
            self,
            company_id: int,
    ) -> List[CompanyArea]:
        statement = (
            select(CompanyAreaModel)
            .where(CompanyAreaModel.company_id == company_id)
            .order_by(CompanyAreaModel.area_id)
        )

        result = await self.session.execute(statement)

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def exists(
            self,
            company_id: int,
            area_id: int,
    ) -> bool:
        statement = select(CompanyAreaModel).where(
            CompanyAreaModel.company_id == company_id,
            CompanyAreaModel.area_id == area_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def save(
            self,
            company_area: CompanyArea,
    ) -> CompanyArea:
        model = CompanyAreaModel(
            company_id=company_area.company_id,
            area_id=company_area.area_id,
        )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(
            self,
            company_id: int,
            area_id: int,
    ) -> bool:
        statement = delete(CompanyAreaModel).where(
            CompanyAreaModel.company_id == company_id,
            CompanyAreaModel.area_id == area_id,
        )

        try:
            result = await self.session.execute(statement)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return result.rowcount > 0
