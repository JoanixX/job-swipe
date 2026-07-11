from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.repositories.student_repository_impl import (StudentRepositoryImpl, )
from app.application.ports.student_port import StudentPort
from app.domain.entities.student import Student


class StudentPortImpl(StudentPort):
    def __init__(self, session: AsyncSession):
        self.student_repo = StudentRepositoryImpl(session)

    async def register_student(self, student_data: dict[str, Any], ) -> Student:
        student = Student(id=0, career=student_data["career"], academic_cycle=student_data["academic_cycle"],
            weekly_availability=student_data["weekly_availability"],
                          preferred_modality=student_data["preferred_modality"],
                          university=student_data.get("university"),
                          embedding=student_data.get("embedding"), )

        return await self.student_repo.save(student)

    async def get_student(self, student_id: int) -> Optional[Student]:
        return await self.student_repo.find_by_id(student_id)

    async def get_all_students(self) -> list[Student]:
        return await self.student_repo.get_all()

    async def update_student(self, student_id: int, student_data: dict[str, Any], ) -> Optional[Student]:
        existing_student = await self.student_repo.find_by_id(student_id)

        if existing_student is None:
            return None

        updated_student = Student(id=student_id, career=student_data.get("career", existing_student.career, ),
                                  academic_cycle=student_data.get("academic_cycle", existing_student.academic_cycle, ),
                                  weekly_availability=student_data.get("weekly_availability",
                                                                       existing_student.weekly_availability, ),
                                  preferred_modality=student_data.get("preferred_modality",
                                                                      existing_student.preferred_modality, ),
                                  university=student_data.get("university", existing_student.university, ),
                                  embedding=student_data.get("embedding", existing_student.embedding, ),
                                  created_at=existing_student.created_at, updated_at=existing_student.updated_at,
                                  deleted_at=existing_student.deleted_at, )

        return await self.student_repo.update(updated_student)

    async def delete_student(self, student_id: int) -> bool:
        return await self.student_repo.delete(student_id)

    async def validate_student_data(self, student_data: dict[str, Any], ) -> bool:
        required_fields = ("weekly_availability", "preferred_modality", "career", "academic_cycle",)

        if any(student_data.get(field) is None for field in required_fields):
            return False

        career = student_data.get("career")

        if not isinstance(career, str) or not career.strip():
            return False

        weekly_availability = student_data["weekly_availability"]
        academic_cycle = student_data["academic_cycle"]
        preferred_modality = student_data["preferred_modality"]

        if not isinstance(weekly_availability, int):
            return False

        if not isinstance(academic_cycle, int):
            return False

        if not isinstance(preferred_modality, int):
            return False

        if not 1 <= weekly_availability <= 40:
            return False

        if not 1 <= academic_cycle <= 12:
            return False

        if preferred_modality not in (1, 2, 3):
            return False

        return True

    async def get_enriched_students(self) -> list[dict[str, Any]]:
        return await self.student_repo.get_enriched_students()
