from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.match_job_student_model import (
    MatchJobStudentModel,
)
from app.domain.entities.match_job_student import MatchJobStudent
from app.domain.repositories.match_job_student_repository import (
    MatchJobStudentRepository,
)


class MatchJobStudentRepositoryImpl(
    MatchJobStudentRepository
):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _active_filter():
        return MatchJobStudentModel.deleted_at.is_(None)

    @staticmethod
    def _to_entity(
            model: MatchJobStudentModel,
    ) -> MatchJobStudent:
        return MatchJobStudent(
            id=model.id,
            student_id=model.student_id,
            job_offer_id=model.job_offer_id,
            score=float(model.score),
            match_date=model.match_date,
            rank=model.rank,
            student_liked=model.student_liked,
            company_liked=model.company_liked,
            created_at=model.created_at,
            updated_at=model.updated_at,
            deleted_at=model.deleted_at,
        )

    async def save(
            self,
            match_job_student: MatchJobStudent,
    ) -> MatchJobStudent:
        model = MatchJobStudentModel(
            student_id=match_job_student.student_id,
            job_offer_id=match_job_student.job_offer_id,
            score=match_job_student.score,
            match_date=match_job_student.match_date,
            rank=match_job_student.rank,
            student_liked=match_job_student.student_liked,
            company_liked=match_job_student.company_liked,
            created_at=match_job_student.created_at or datetime.utcnow(),
            updated_at=match_job_student.updated_at or datetime.utcnow(),
            deleted_at=match_job_student.deleted_at,
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
            match_id: int,
    ) -> Optional[MatchJobStudent]:
        statement = select(MatchJobStudentModel).where(
            MatchJobStudentModel.id == match_id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        return self._to_entity(model) if model else None

    async def find_by_student_id(
            self,
            student_id: int,
    ) -> List[MatchJobStudent]:
        statement = (
            select(MatchJobStudentModel)
            .where(
                MatchJobStudentModel.student_id == student_id,
                self._active_filter(),
            )
            .order_by(
                MatchJobStudentModel.score.desc(),
                MatchJobStudentModel.rank,
            )
        )

        result = await self.session.execute(statement)

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def find_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[MatchJobStudent]:
        statement = (
            select(MatchJobStudentModel)
            .where(
                MatchJobStudentModel.job_offer_id == job_offer_id,
                self._active_filter(),
            )
            .order_by(
                MatchJobStudentModel.score.desc(),
                MatchJobStudentModel.rank,
            )
        )

        result = await self.session.execute(statement)

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def find_by_student_and_offer(
            self,
            student_id: int,
            job_offer_id: int,
    ) -> Optional[MatchJobStudent]:
        statement = select(MatchJobStudentModel).where(
            MatchJobStudentModel.student_id == student_id,
            MatchJobStudentModel.job_offer_id == job_offer_id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        return self._to_entity(model) if model else None

    async def update(
            self,
            match_job_student: MatchJobStudent,
    ) -> Optional[MatchJobStudent]:
        statement = select(MatchJobStudentModel).where(
            MatchJobStudentModel.id == match_job_student.id,
            self._active_filter(),
        )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.score = match_job_student.score
        model.match_date = match_job_student.match_date
        model.rank = match_job_student.rank
        model.student_liked = match_job_student.student_liked
        model.company_liked = match_job_student.company_liked
        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)
