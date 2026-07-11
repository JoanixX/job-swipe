from typing import List

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.job_offer_required_skill_model import (
    JobOfferRequiredSkillModel,
)
from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)
from app.domain.repositories.job_offer_required_skill_repository import (
    JobOfferRequiredSkillRepository,
)


class JobOfferRequiredSkillRepositoryImpl(
    JobOfferRequiredSkillRepository
):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(
            model: JobOfferRequiredSkillModel,
    ) -> JobOfferRequiredSkill:
        return JobOfferRequiredSkill(
            job_offer_id=model.job_offer_id,
            skill_id=model.skill_id,
        )

    async def get_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[JobOfferRequiredSkill]:
        statement = (
            select(JobOfferRequiredSkillModel)
            .where(
                JobOfferRequiredSkillModel.job_offer_id == job_offer_id
            )
            .order_by(JobOfferRequiredSkillModel.skill_id)
        )

        result = await self.session.execute(statement)

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def exists(
            self,
            job_offer_id: int,
            skill_id: int,
    ) -> bool:
        statement = select(JobOfferRequiredSkillModel).where(
            JobOfferRequiredSkillModel.job_offer_id == job_offer_id,
            JobOfferRequiredSkillModel.skill_id == skill_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def save(
            self,
            job_offer_required_skill: JobOfferRequiredSkill,
    ) -> JobOfferRequiredSkill:
        model = JobOfferRequiredSkillModel(
            job_offer_id=job_offer_required_skill.job_offer_id,
            skill_id=job_offer_required_skill.skill_id,
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
            skill_id: int,
    ) -> bool:
        statement = delete(JobOfferRequiredSkillModel).where(
            JobOfferRequiredSkillModel.job_offer_id == job_offer_id,
            JobOfferRequiredSkillModel.skill_id == skill_id,
        )

        try:
            result = await self.session.execute(statement)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return result.rowcount > 0
