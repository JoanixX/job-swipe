from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)


class JobOfferRequiredSkillRepository(ABC):
    @abstractmethod
    async def get_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[JobOfferRequiredSkill]:
        raise NotImplementedError

    @abstractmethod
    async def exists(
            self,
            job_offer_id: int,
            skill_id: int,
    ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def save(
            self,
            job_offer_required_skill: JobOfferRequiredSkill,
    ) -> JobOfferRequiredSkill:
        raise NotImplementedError

    @abstractmethod
    async def delete(
            self,
            job_offer_id: int,
            skill_id: int,
    ) -> bool:
        raise NotImplementedError
