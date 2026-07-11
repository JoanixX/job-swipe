from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.job_offer_area import JobOfferArea


class JobOfferAreaRepository(ABC):
    @abstractmethod
    async def get_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[JobOfferArea]:
        raise NotImplementedError

    @abstractmethod
    async def exists(
            self,
            job_offer_id: int,
            area_id: int,
    ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def save(
            self,
            job_offer_area: JobOfferArea,
    ) -> JobOfferArea:
        raise NotImplementedError

    @abstractmethod
    async def delete(
            self,
            job_offer_id: int,
            area_id: int,
    ) -> bool:
        raise NotImplementedError
