from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.experience_detail_model import (
    ExperienceDetailModel,
)
from app.domain.entities.experience_detail import ExperienceDetail
from app.domain.repositories.experience_detail_repository import (
    ExperienceDetailRepository,
)


class ExperienceDetailRepositoryImpl(ExperienceDetailRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: ExperienceDetailModel) -> ExperienceDetail:
        return ExperienceDetail(
            id=model.id,
            student_id=model.student_id,
            job_offer_id=model.job_offer_id,
            name=model.name,
            description=model.description,
            duration_in_months=model.duration_in_months,
            created_at=model.created_at,
            updated_at=model.updated_at,
            deleted_at=model.deleted_at,
        )

    @staticmethod
    def _active_filter():
        return ExperienceDetailModel.deleted_at.is_(None)

    async def save(self, experience_detail: ExperienceDetail):
        model = ExperienceDetailModel(
            student_id=experience_detail.student_id,
            job_offer_id=experience_detail.job_offer_id,
            name=experience_detail.name,
            description=experience_detail.description,
            duration_in_months=experience_detail.duration_in_months,
        )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(
            self,
            experience_detail_id: int,
    ) -> Optional[ExperienceDetail]:
        result = await self.session.execute(
            select(ExperienceDetailModel).where(
                ExperienceDetailModel.id == experience_detail_id,
                self._active_filter(),
            )
        )

        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def find_by_student_id(
            self,
            student_id: int,
    ) -> list[ExperienceDetail]:
        result = await self.session.execute(
            select(ExperienceDetailModel)
            .where(
                ExperienceDetailModel.student_id == student_id,
                self._active_filter(),
            )
            .order_by(ExperienceDetailModel.created_at.desc())
        )

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def find_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> list[ExperienceDetail]:
        result = await self.session.execute(
            select(ExperienceDetailModel)
            .where(
                ExperienceDetailModel.job_offer_id == job_offer_id,
                self._active_filter(),
            )
            .order_by(ExperienceDetailModel.created_at.desc())
        )

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def get_all(self) -> list[ExperienceDetail]:
        result = await self.session.execute(
            select(ExperienceDetailModel)
            .where(self._active_filter())
            .order_by(ExperienceDetailModel.created_at.desc())
        )

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def update(
            self,
            experience_detail: ExperienceDetail,
    ) -> Optional[ExperienceDetail]:
        result = await self.session.execute(
            select(ExperienceDetailModel).where(
                ExperienceDetailModel.id == experience_detail.id,
                self._active_filter(),
            )
        )

        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.student_id = experience_detail.student_id
        model.job_offer_id = experience_detail.job_offer_id
        model.name = experience_detail.name
        model.description = experience_detail.description
        model.duration_in_months = experience_detail.duration_in_months
        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(self, experience_detail_id: int) -> bool:
        result = await self.session.execute(
            select(ExperienceDetailModel).where(
                ExperienceDetailModel.id == experience_detail_id,
                self._active_filter(),
            )
        )

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