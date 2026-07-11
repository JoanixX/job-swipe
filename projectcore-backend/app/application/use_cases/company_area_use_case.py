from typing import Any, Dict, List

from app.application.ports.company_area_port import CompanyAreaPort
from app.domain.entities.company_area import CompanyArea
from app.domain.services.company_area_service import CompanyAreaService


class CompanyAreaUseCase:
    def __init__(
            self,
            company_area_port: CompanyAreaPort,
            company_area_service: CompanyAreaService,
    ):
        self.company_area_port = company_area_port
        self.company_area_service = company_area_service

    async def get_company_areas(
            self,
            company_id: int,
    ) -> List[CompanyArea]:
        return await self.company_area_port.get_company_areas(
            company_id
        )

    async def add_company_area(
            self,
            company_area: CompanyArea,
    ) -> CompanyArea:
        if (
                company_area.company_id <= 0
                or company_area.area_id <= 0
        ):
            raise ValueError("Los IDs deben ser positivos")

        return await self.company_area_port.add_company_area(
            company_area
        )

    async def delete_company_area(
            self,
            company_id: int,
            area_id: int,
    ) -> Dict[str, Any]:
        deleted = await self.company_area_port.delete_company_area(
            company_id,
            area_id,
        )

        if not deleted:
            raise ValueError(
                f"No existe el área {area_id} asociada "
                f"a la compañía {company_id}"
            )

        return {
            "message": (
                "Área eliminada exitosamente de la compañía"
            )
        }