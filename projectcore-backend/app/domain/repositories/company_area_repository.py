from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.company_area import CompanyArea


class CompanyAreaRepository(ABC):
    @abstractmethod
    async def get_by_company_id(
            self,
            company_id: int,
    ) -> List[CompanyArea]:
        raise NotImplementedError

    @abstractmethod
    async def exists(
            self,
            company_id: int,
            area_id: int,
    ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def save(
            self,
            company_area: CompanyArea,
    ) -> CompanyArea:
        raise NotImplementedError

    @abstractmethod
    async def delete(
            self,
            company_id: int,
            area_id: int,
    ) -> bool:
        raise NotImplementedError
