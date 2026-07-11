from typing import List

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.job_offer_area_model import (
    JobOfferAreaModel,
)
from app.domain.entities.job_offer_area import JobOfferArea
from app.domain.repositories.job_offer_area_repository import (
    JobOfferAreaRepository,
)


class JobOfferAreaRepositoryImpl(JobOfferAreaRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: JobOfferAreaModel) -> JobOfferArea:
        return JobOfferArea(
            job_offer_id=model.job_offer_id,
            area_id=model.area_id,
        )

    async def get_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[JobOfferArea]:
        statement = (
            select(JobOfferAreaModel)
            .where(JobOfferAreaModel.job_offer_id == job_offer_id)
            .order_by(JobOfferAreaModel.area_id)
        )

        result = await self.session.execute(statement)

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def exists(
            self,
            job_offer_id: int,
            area_id: int,
    ) -> bool:
        statement = select(JobOfferAreaModel).where(
            JobOfferAreaModel.job_offer_id == job_offer_id,
            JobOfferAreaModel.area_id == area_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def save(
            self,
            job_offer_area: JobOfferArea,
    ) -> JobOfferArea:
        model = JobOfferAreaModel(
            job_offer_id=job_offer_area.job_offer_id,
            area_id=job_offer_area.area_id,
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
            job_offer_id: int,
            area_id: int,
    ) -> bool:
        statement = delete(JobOfferAreaModel).where(
            JobOfferAreaModel.job_offer_id == job_offer_id,
            JobOfferAreaModel.area_id == area_id,
        )

        try:
            result = await self.session.execute(statement)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return result.rowcount > 0
