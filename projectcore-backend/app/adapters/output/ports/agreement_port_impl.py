import logging
from datetime import datetime
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.repositories.agreement_repository_impl import AgreementRepositoryImpl
from app.application.ports.agreement_port import AgreementPort
from app.domain.entities.agreement import Agreement, AgreementStatus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgreementPortImpl(AgreementPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.agreement_repo = AgreementRepositoryImpl(session)

    @staticmethod
    def _parse_status(status: Any) -> AgreementStatus:
        if isinstance(status, AgreementStatus):
            return status

        return AgreementStatus(status)

    async def register_agreement(self, agreement_data: dict[str, Any], ) -> Agreement:
        status = self._parse_status(agreement_data.get("status", AgreementStatus.pending, ))

        agreement = Agreement(id=0, job_offer_id=agreement_data["job_offer_id"],
                              student_id=agreement_data["student_id"], status=status,
                              start_date=agreement_data.get("start_date"),
                              end_date=agreement_data.get("end_date"), created_at=agreement_data.get("created_at"),
                              updated_at=agreement_data.get("updated_at"),
                              deleted_at=agreement_data.get("deleted_at"), )

        return await self.agreement_repo.save(agreement)

    async def get_agreement(self, agreement_id: int, ) -> Optional[Agreement]:
        return await self.agreement_repo.find_by_id(agreement_id)

    async def get_student_agreements(self, student_id: int, ) -> list[Agreement]:
        return await self.agreement_repo.find_by_student_id(student_id)

    async def get_job_offer_agreements(self, job_offer_id: int, ) -> list[Agreement]:
        return await self.agreement_repo.find_by_job_offer_id(job_offer_id)

    async def get_all_agreements(self) -> list[Agreement]:
        return await self.agreement_repo.get_all()

    async def update_agreement(self, agreement_id: int, agreement_data: dict[str, Any], ) -> Optional[Agreement]:
        existing_agreement = await self.agreement_repo.find_by_id(agreement_id)

        if existing_agreement is None:
            return None

        status = self._parse_status(agreement_data.get("status", existing_agreement.status, ))

        updated_agreement = Agreement(id=agreement_id,
                                      job_offer_id=agreement_data.get("job_offer_id",
                                                                      existing_agreement.job_offer_id, ),
                                      student_id=agreement_data.get("student_id", existing_agreement.student_id, ),
                                      status=status,
                                      start_date=agreement_data.get("start_date", existing_agreement.start_date, ),
                                      end_date=agreement_data.get("end_date", existing_agreement.end_date, ),
                                      created_at=existing_agreement.created_at, updated_at=datetime.utcnow(),
                                      deleted_at=existing_agreement.deleted_at, )

        return await self.agreement_repo.update(updated_agreement)

    async def delete_agreement(self, agreement_id: int) -> bool:
        return await self.agreement_repo.delete(agreement_id)

    async def validate_agreement_data(self, agreement_data: dict[str, Any], ) -> bool:
        required_fields = ("job_offer_id", "student_id",)

        for field in required_fields:
            value = agreement_data.get(field)

            if value is None:
                return False

            if isinstance(value, int) and value <= 0:
                return False

        start_date = agreement_data.get("start_date")
        end_date = agreement_data.get("end_date")

        if start_date is not None and end_date is not None:
            if end_date <= start_date:
                return False

        try:
            self._parse_status(agreement_data.get("status", AgreementStatus.pending, ))
        except ValueError:
            return False

        return True

    async def check_agreement_exists(self, student_id: int, job_offer_id: int, ) -> bool:
        agreement = await self.agreement_repo.find_active_agreement(job_offer_id=job_offer_id, student_id=student_id, )

        return agreement is not None
