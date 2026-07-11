from abc import ABC, abstractmethod
from typing import Any, Optional

from app.domain.entities.agreement import Agreement


class AgreementPort(ABC):
    @abstractmethod
    async def register_agreement(self, agreement_data: dict[str, Any], ) -> Agreement:
        raise NotImplementedError

    @abstractmethod
    async def get_agreement(self, agreement_id: int, ) -> Optional[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def get_student_agreements(self, student_id: int, ) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def get_job_offer_agreements(self, job_offer_id: int, ) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def get_all_agreements(self) -> list[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def update_agreement(self, agreement_id: int, agreement_data: dict[str, Any], ) -> Optional[Agreement]:
        raise NotImplementedError

    @abstractmethod
    async def delete_agreement(self, agreement_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def validate_agreement_data(self, agreement_data: dict[str, Any], ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def check_agreement_exists(self, student_id: int, job_offer_id: int, ) -> bool:
        raise NotImplementedError
