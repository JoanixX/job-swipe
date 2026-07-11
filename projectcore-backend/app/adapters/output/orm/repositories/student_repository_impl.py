from datetime import datetime
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.app_user_model import (AppUserModel, UserRole, )
from app.adapters.output.orm.models.experience_detail_model import (ExperienceDetailModel, )
from app.adapters.output.orm.models.interest_model import InterestModel
from app.adapters.output.orm.models.skill_model import SkillModel
from app.adapters.output.orm.models.student_interest_model import (StudentInterestModel, )
from app.adapters.output.orm.models.student_model import StudentModel
from app.adapters.output.orm.models.student_skill_model import (StudentSkillModel, )
from app.domain.entities.student import Student
from app.domain.repositories.student_repository import StudentRepository


class StudentRepositoryImpl(StudentRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: StudentModel) -> Student:
        return Student(id=model.id, career=model.career, academic_cycle=model.academic_cycle,
                       weekly_availability=model.weekly_availability, preferred_modality=model.preferred_modality,
                       university=model.university, embedding=model.embedding, created_at=model.created_at,
                       updated_at=model.updated_at, deleted_at=model.deleted_at, )

    @staticmethod
    def _active_filter():
        return StudentModel.deleted_at.is_(None)

    async def save(self, student: Student) -> Student:
        model = StudentModel(career=student.career, academic_cycle=student.academic_cycle,
                             weekly_availability=student.weekly_availability,
                             preferred_modality=student.preferred_modality, university=student.university,
                             embedding=student.embedding, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(self, student_id: int) -> Optional[Student]:
        result = await self.session.execute(
            select(StudentModel).where(StudentModel.id == student_id, self._active_filter(), ))

        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_all(self) -> list[Student]:
        result = await self.session.execute(
            select(StudentModel).where(self._active_filter()).order_by(StudentModel.created_at.desc()))

        models = result.scalars().all()
        return [self._to_entity(model) for model in models]

    async def update(self, student: Student) -> Optional[Student]:
        result = await self.session.execute(
            select(StudentModel).where(StudentModel.id == student.id, self._active_filter(), ))

        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.career = student.career
        model.academic_cycle = student.academic_cycle
        model.weekly_availability = student.weekly_availability
        model.preferred_modality = student.preferred_modality
        model.university = student.university
        model.embedding = student.embedding
        model.updated_at = datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(self, student_id: int) -> bool:
        result = await self.session.execute(
            select(StudentModel).where(StudentModel.id == student_id, self._active_filter(), ))

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

    async def get_enriched_students(self) -> list[dict[str, Any]]:
        result = await self.session.execute(
            select(StudentModel).where(self._active_filter()).order_by(StudentModel.created_at.desc()))

        students = result.scalars().all()
        enriched_students = []

        for student in students:
            skills_result = await self.session.execute(
                select(SkillModel.name).join(StudentSkillModel, StudentSkillModel.skill_id == SkillModel.id, ).where(
                    StudentSkillModel.student_id == student.id).order_by(SkillModel.name))

            interests_result = await self.session.execute(select(InterestModel.name).join(StudentInterestModel,
                                                                                          StudentInterestModel.interest_id == InterestModel.id, ).where(
                StudentInterestModel.student_id == student.id).order_by(InterestModel.name))

            experiences_result = await self.session.execute(
                select(ExperienceDetailModel.name, ExperienceDetailModel.description, ).where(
                    ExperienceDetailModel.student_id == student.id,
                    ExperienceDetailModel.deleted_at.is_(None), ).order_by(ExperienceDetailModel.created_at.desc()))

            user_result = await self.session.execute(
                select(AppUserModel.description).where(AppUserModel.related_id == student.id,
                                                       AppUserModel.role == UserRole.student,
                                                       AppUserModel.deleted_at.is_(None), ).limit(1))

            enriched_students.append(
                {"id": student.id, "career": student.career, "academic_cycle": student.academic_cycle,
                 "weekly_availability": student.weekly_availability,
                 "preferred_modality": student.preferred_modality, "university": student.university,
                 "embedding": student.embedding,
                 "skills": [{"name": name} for name in skills_result.scalars().all()],
                 "interests": [{"name": name} for name in interests_result.scalars().all()],
                 "experience_details": [{"name": name, "description": description, } for name, description in
                                        experiences_result.all()], "description": user_result.scalar_one_or_none(), })

        return enriched_students
