from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.area_model import AreaModel
from app.adapters.output.orm.models.company_model import CompanyModel
from app.adapters.output.orm.repositories.company_area_repository_impl import (
    CompanyAreaRepositoryImpl,
)
from app.application.ports.company_area_port import CompanyAreaPort
from app.domain.entities.company_area import CompanyArea


class CompanyAreaPortImpl(CompanyAreaPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.company_area_repo = CompanyAreaRepositoryImpl(session)

    async def _company_is_active(self, company_id: int) -> bool:
        statement = select(CompanyModel.id).where(
            CompanyModel.id == company_id,
            CompanyModel.deleted_at.is_(None),
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def _area_exists(self, area_id: int) -> bool:
        statement = select(AreaModel.id).where(
            AreaModel.id == area_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def add_company_area(
            self,
            company_area: CompanyArea,
    ) -> CompanyArea:
        if not await self._company_is_active(
                company_area.company_id
        ):
            raise ValueError(
                "La compañía no existe o está eliminada"
            )

        if not await self._area_exists(company_area.area_id):
            raise ValueError("El área no existe")

        if await self.company_area_repo.exists(
                company_area.company_id,
                company_area.area_id,
        ):
            raise ValueError(
                "La compañía ya tiene esta área asignada"
            )

        return await self.company_area_repo.save(company_area)

    async def get_company_areas(
            self,
            company_id: int,
    ) -> List[CompanyArea]:
        if company_id <= 0:
            raise ValueError(
                "El ID de la compañía debe ser positivo"
            )

        if not await self._company_is_active(company_id):
            raise ValueError(
                "La compañía no existe o está eliminada"
            )

        return await self.company_area_repo.get_by_company_id(
            company_id
        )

    async def delete_company_area(
            self,
            company_id: int,
            area_id: int,
    ) -> bool:
        if company_id <= 0 or area_id <= 0:
            raise ValueError("Los IDs deben ser positivos")

        return await self.company_area_repo.delete(
            company_id,
            area_id,
        )
