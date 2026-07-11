from typing import List

from app.domain.entities.job_offer_area import JobOfferArea
from app.domain.repositories.job_offer_area_repository import (
    JobOfferAreaRepository,
)


class JobOfferAreaService:
    def __init__(
            self,
            job_offer_area_repo: JobOfferAreaRepository,
    ):
        self.job_offer_area_repo = job_offer_area_repo

    async def add_job_offer_area(
            self,
            job_offer_area: JobOfferArea,
    ) -> JobOfferArea:
        if (
                job_offer_area.job_offer_id <= 0
                or job_offer_area.area_id <= 0
        ):
            raise ValueError("Los IDs deben ser positivos")

        if await self.job_offer_area_repo.exists(
                job_offer_area.job_offer_id,
                job_offer_area.area_id,
        ):
            raise ValueError(
                "La oferta ya tiene esta área asignada"
            )

        return await self.job_offer_area_repo.save(job_offer_area)

    async def get_job_offer_areas(
            self,
            job_offer_id: int,
    ) -> List[JobOfferArea]:
        if job_offer_id <= 0:
            raise ValueError(
                "El ID de la oferta debe ser positivo"
            )

        return await self.job_offer_area_repo.get_by_job_offer_id(
            job_offer_id
        )

    async def delete_job_offer_area(
            self,
            job_offer_id: int,
            area_id: int,
    ) -> bool:
        if job_offer_id <= 0 or area_id <= 0:
            raise ValueError("Los IDs deben ser positivos")

        return await self.job_offer_area_repo.delete(
            job_offer_id,
            area_id,
        )
