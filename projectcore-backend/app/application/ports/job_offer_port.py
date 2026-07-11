from abc import ABC, abstractmethod
from typing import Any, Optional

from app.domain.entities.job_offer import JobOffer


class JobOfferPort(ABC):
    @abstractmethod
    async def get_enriched_job_offers(self) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    async def register_job_offer(self, job_offer_data: dict[str, Any], ) -> JobOffer:
        raise NotImplementedError

    @abstractmethod
    async def get_job_offer(self, job_offer_id: int, ) -> Optional[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def get_job_offers_by_company_id(self, company_id: int, ) -> list[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def get_all_job_offers(self) -> list[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def update_job_offer(self, job_offer_id: int, job_offer_data: dict[str, Any], ) -> Optional[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def delete_job_offer(self, job_offer_id: int, ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def validate_job_offer_data(self, job_offer_data: dict[str, Any], partial: bool = False, ) -> bool:
        raise NotImplementedError
