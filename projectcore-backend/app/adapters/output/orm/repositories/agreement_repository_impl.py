from datetime import datetime
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.adapters.output.orm.models.agreement_model import AgreementModel, AgreementStatus as AgreementStatusModel
from app.domain.entities.agreement import Agreement, AgreementStatus
from app.domain.repositories.agreement_repository import AgreementRepository


class AgreementRepositoryImpl(AgreementRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _to_entity(model: AgreementModel) -> Agreement:
        status = model.status

        if isinstance(status, AgreementStatusModel):
            status = status.value

        return Agreement(id=model.id, job_offer_id=model.job_offer_id, student_id=model.student_id,
                         status=AgreementStatus(status), start_date=model.start_date, end_date=model.end_date,
                         created_at=model.created_at, updated_at=model.updated_at, deleted_at=model.deleted_at, )

    @staticmethod
    def _not_deleted_filter():
        return AgreementModel.deleted_at.is_(None)

    async def save(self, agreement: Agreement) -> Agreement:
        model = AgreementModel(job_offer_id=agreement.job_offer_id, student_id=agreement.student_id,
                               status=AgreementStatusModel(agreement.status.value), start_date=agreement.start_date,
                               end_date=agreement.end_date, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(self, agreement_id: int, ) -> Optional[Agreement]:
        statement = select(AgreementModel).where(AgreementModel.id == agreement_id, self._not_deleted_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        return self._to_entity(model)

    async def find_by_student_id(self, student_id: int, ) -> list[Agreement]:
        statement = (select(AgreementModel).where(AgreementModel.student_id == student_id,
                                                  self._not_deleted_filter(), ).order_by(
            AgreementModel.created_at.desc()))

        result = await self.session.execute(statement)
        models = result.scalars().all()

        return [self._to_entity(model) for model in models]

    async def find_by_job_offer_id(self, job_offer_id: int, ) -> list[Agreement]:
        statement = (select(AgreementModel).where(AgreementModel.job_offer_id == job_offer_id,
                                                  self._not_deleted_filter(), ).order_by(
            AgreementModel.created_at.desc()))

        result = await self.session.execute(statement)
        models = result.scalars().all()

        return [self._to_entity(model) for model in models]

    async def find_active_agreement(self, job_offer_id: int, student_id: int, ) -> Optional[Agreement]:
        statement = select(AgreementModel).where(AgreementModel.job_offer_id == job_offer_id,
                                                 AgreementModel.student_id == student_id,
                                                 AgreementModel.status == AgreementStatusModel.active,
                                                 self._not_deleted_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        return self._to_entity(model)

    async def get_all(self) -> list[Agreement]:
        statement = (
            select(AgreementModel).where(self._not_deleted_filter()).order_by(AgreementModel.created_at.desc()))

        result = await self.session.execute(statement)
        models = result.scalars().all()

        return [self._to_entity(model) for model in models]

    async def update(self, agreement: Agreement, ) -> Optional[Agreement]:
        statement = select(AgreementModel).where(AgreementModel.id == agreement.id, self._not_deleted_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.job_offer_id = agreement.job_offer_id
        model.student_id = agreement.student_id
        model.status = AgreementStatusModel(agreement.status.value)
        model.start_date = agreement.start_date
        model.end_date = agreement.end_date
        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(self, agreement_id: int) -> bool:
        statement = select(AgreementModel).where(AgreementModel.id == agreement_id, self._not_deleted_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return False

        model.deleted_at = datetime.utcnow()

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True
