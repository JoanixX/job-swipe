from typing import List

from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)
from app.domain.repositories.job_offer_required_skill_repository import (
    JobOfferRequiredSkillRepository,
)


class JobOfferRequiredSkillService:
    def __init__(
            self,
            repository: JobOfferRequiredSkillRepository,
    ):
        self.repository = repository

    async def add_job_offer_required_skill(
            self,
            entity: JobOfferRequiredSkill,
    ) -> JobOfferRequiredSkill:
        if entity.job_offer_id <= 0 or entity.skill_id <= 0:
            raise ValueError("Los IDs deben ser positivos")

        if await self.repository.exists(
                entity.job_offer_id,
                entity.skill_id,
        ):
            raise ValueError(
                "La oferta ya tiene esta habilidad requerida"
            )

        return await self.repository.save(entity)

    async def get_job_offer_required_skills(
            self,
            job_offer_id: int,
    ) -> List[JobOfferRequiredSkill]:
        if job_offer_id <= 0:
            raise ValueError(
                "El ID de la oferta debe ser positivo"
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
