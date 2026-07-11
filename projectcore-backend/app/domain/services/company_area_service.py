from typing import List

from app.domain.entities.company_area import CompanyArea
from app.domain.repositories.company_area_repository import (
    CompanyAreaRepository,
)


class CompanyAreaService:
    def __init__(
            self,
            company_area_repo: CompanyAreaRepository,
    ):
        self.company_area_repo = company_area_repo

    async def add_company_area(
            self,
            company_area: CompanyArea,
    ) -> CompanyArea:
        if (
                company_area.company_id <= 0
                or company_area.area_id <= 0
        ):
            raise ValueError("Los IDs deben ser positivos")

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
