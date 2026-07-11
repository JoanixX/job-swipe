from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.job_offer import JobOffer


class JobOfferRepository(ABC):
    @abstractmethod
    async def get_enriched_job_offers(self) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    async def save(self, job_offer: JobOffer) -> JobOffer:
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(self, job_offer_id: int, ) -> Optional[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_company_id(self, company_id: int, ) -> list[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def get_all(self) -> list[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def update(self, job_offer: JobOffer, ) -> Optional[JobOffer]:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, job_offer_id: int) -> bool:
        raise NotImplementedError
