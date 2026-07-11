from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.agreement import Agreement


class AgreementRepository(ABC):
    @abstractmethod
    async def save(self, agreement: Agreement) -> Agreement:
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(self, agreement_id: int) -> Optional[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_student_id(self, student_id: int, ) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_job_offer_id(self, job_offer_id: int, ) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def find_active_agreement(self, job_offer_id: int, student_id: int, ) -> Optional[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def get_all(self) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def update(self, agreement: Agreement, ) -> Optional[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, agreement_id: int) -> bool:
        raise NotImplementedError
