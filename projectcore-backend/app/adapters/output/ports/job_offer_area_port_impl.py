from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.area_model import AreaModel
from app.adapters.output.orm.models.job_offer_model import JobOfferModel
from app.adapters.output.orm.repositories.job_offer_area_repository_impl import (
    JobOfferAreaRepositoryImpl,
)
from app.application.ports.job_offer_area_port import JobOfferAreaPort
from app.domain.entities.job_offer_area import JobOfferArea


class JobOfferAreaPortImpl(JobOfferAreaPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.job_offer_area_repo = JobOfferAreaRepositoryImpl(session)

    async def _job_offer_is_active(
            self,
            job_offer_id: int,
    ) -> bool:
        statement = select(JobOfferModel.id).where(
            JobOfferModel.id == job_offer_id,
            JobOfferModel.deleted_at.is_(None),
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def _area_exists(self, area_id: int) -> bool:
        statement = select(AreaModel.id).where(
            AreaModel.id == area_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def add_job_offer_area(
            self,
            job_offer_area: JobOfferArea,
    ) -> JobOfferArea:
        if not await self._job_offer_is_active(
                job_offer_area.job_offer_id
        ):
            raise ValueError(
                "La oferta no existe o está eliminada"
            )

        if not await self._area_exists(job_offer_area.area_id):
            raise ValueError("El área no existe")

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

        if not await self._job_offer_is_active(job_offer_id):
            raise ValueError(
                "La oferta no existe o está eliminada"
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
