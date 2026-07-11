from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.job_offer_model import JobOfferModel
from app.adapters.output.orm.models.skill_model import SkillModel
from app.adapters.output.orm.repositories.job_offer_required_skill_repository_impl import (
    JobOfferRequiredSkillRepositoryImpl,
)
from app.application.ports.job_offer_required_skill_port import (
    JobOfferRequiredSkillPort,
)
from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)


class JobOfferRequiredSkillPortImpl(JobOfferRequiredSkillPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = JobOfferRequiredSkillRepositoryImpl(
            session
        )

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

    async def _skill_exists(self, skill_id: int) -> bool:
        statement = select(SkillModel.id).where(
            SkillModel.id == skill_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none() is not None

    async def add_job_offer_required_skill(
            self,
            job_offer_required_skill: JobOfferRequiredSkill,
    ) -> JobOfferRequiredSkill:
        job_offer_id = job_offer_required_skill.job_offer_id
        skill_id = job_offer_required_skill.skill_id

        if not await self._job_offer_is_active(job_offer_id):
            raise ValueError(
                "La oferta no existe o está eliminada"
            )

        if not await self._skill_exists(skill_id):
            raise ValueError("La habilidad no existe")

        if await self.repository.exists(
                job_offer_id,
                skill_id,
        ):
            raise ValueError(
                "La oferta ya tiene esta habilidad requerida"
            )

        return await self.repository.save(
            job_offer_required_skill
        )

    async def get_job_offer_required_skills(
            self,
            job_offer_id: int,
    ) -> List[JobOfferRequiredSkill]:
        if job_offer_id <= 0:
            raise ValueError(
                "El ID de la oferta debe ser positivo"
            )

        if not await self._job_offer_is_active(job_offer_id):
            raise ValueError(
                "La oferta no existe o está eliminada"
            )

        return await self.repository.get_by_job_offer_id(
            job_offer_id
        )

    async def delete_job_offer_required_skill(
            self,
            job_offer_id: int,
            skill_id: int,
    ) -> bool:
        if job_offer_id <= 0 or skill_id <= 0:
            raise ValueError("Los IDs deben ser positivos")

        return await self.repository.delete(
            job_offer_id,
            skill_id,
        )
