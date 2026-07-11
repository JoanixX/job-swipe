from typing import List

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.student_skill_model import (StudentSkillModel, )
from app.domain.entities.student_skill import StudentSkill
from app.domain.repositories.student_skill_repository import (StudentSkillRepository, )


class StudentSkillRepositoryImpl(StudentSkillRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_student_id(self, student_id: int, ) -> List[StudentSkill]:
        result = await self.session.execute(
            select(StudentSkillModel).where(StudentSkillModel.student_id == student_id).order_by(
                StudentSkillModel.skill_id))

        return [StudentSkill(student_id=model.student_id, skill_id=model.skill_id, ) for model in
                result.scalars().all()]

    async def exists(self, student_id: int, skill_id: int, ) -> bool:
        result = await self.session.execute(select(StudentSkillModel).where(StudentSkillModel.student_id == student_id,
                                                                            StudentSkillModel.skill_id == skill_id, ))

        return result.scalar_one_or_none() is not None

    async def save(self, student_skill: StudentSkill, ) -> StudentSkill:
        model = StudentSkillModel(student_id=student_skill.student_id, skill_id=student_skill.skill_id, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return StudentSkill(student_id=model.student_id, skill_id=model.skill_id, )

    async def delete(self, student_id: int, skill_id: int, ) -> bool:
        result = await self.session.execute(delete(StudentSkillModel).where(StudentSkillModel.student_id == student_id,
                                                                            StudentSkillModel.skill_id == skill_id, ))

        if result.rowcount == 0:
            return False

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True
