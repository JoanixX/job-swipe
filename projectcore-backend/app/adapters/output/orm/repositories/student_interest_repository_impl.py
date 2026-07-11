from typing import List

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.student_interest_model import (StudentInterestModel, )
from app.domain.entities.student_interest import StudentInterest
from app.domain.repositories.student_interest_repository import (StudentInterestRepository, )


class StudentInterestRepositoryImpl(StudentInterestRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_student_id(self, student_id: int, ) -> List[StudentInterest]:
        result = await self.session.execute(
            select(StudentInterestModel).where(StudentInterestModel.student_id == student_id).order_by(
                StudentInterestModel.interest_id))

        return [StudentInterest(student_id=model.student_id, interest_id=model.interest_id, ) for model in
                result.scalars().all()]

    async def exists(self, student_id: int, interest_id: int, ) -> bool:
        result = await self.session.execute(
            select(StudentInterestModel).where(StudentInterestModel.student_id == student_id,
                                               StudentInterestModel.interest_id == interest_id, ))

        return result.scalar_one_or_none() is not None

    async def save(self, student_interest: StudentInterest, ) -> StudentInterest:
        model = StudentInterestModel(student_id=student_interest.student_id, interest_id=student_interest.interest_id, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return StudentInterest(student_id=model.student_id, interest_id=model.interest_id, )

    async def delete(self, student_id: int, interest_id: int, ) -> bool:
        result = await self.session.execute(
            delete(StudentInterestModel).where(StudentInterestModel.student_id == student_id,
                                               StudentInterestModel.interest_id == interest_id, ))

        if result.rowcount == 0:
            return False

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True
