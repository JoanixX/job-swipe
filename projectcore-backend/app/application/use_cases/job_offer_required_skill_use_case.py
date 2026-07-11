from typing import Any, Dict, List

from app.application.ports.job_offer_required_skill_port import (
    JobOfferRequiredSkillPort,
)
from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)
from app.domain.services.job_offer_required_skill_service import (
    JobOfferRequiredSkillService,
)


class JobOfferRequiredSkillUseCase:
    def __init__(
            self,
            port: JobOfferRequiredSkillPort,
            service: JobOfferRequiredSkillService,
    ):
        self.port = port
        self.service = service

    async def get_job_offer_required_skills(
            self,
            job_offer_id: int,
    ) -> List[JobOfferRequiredSkill]:
        return await self.port.get_job_offer_required_skills(
            job_offer_id
        )

    async def add_job_offer_required_skill(
            self,
            entity: JobOfferRequiredSkill,
    ) -> JobOfferRequiredSkill:
        if entity.job_offer_id <= 0 or entity.skill_id <= 0:
            raise ValueError("Los IDs deben ser positivos")

        return await self.port.add_job_offer_required_skill(entity)

    async def delete_job_offer_required_skill(
            self,
            job_offer_id: int,
            skill_id: int,
    ) -> Dict[str, Any]:
        deleted = await self.port.delete_job_offer_required_skill(
            job_offer_id,
            skill_id,
        )

        if not deleted:
            raise ValueError(
                f"La habilidad {skill_id} no está asociada "
                f"a la oferta {job_offer_id}"
            )

        return {
            "message": (
                "Habilidad eliminada exitosamente "
                "de la oferta de trabajo"
            )
        }