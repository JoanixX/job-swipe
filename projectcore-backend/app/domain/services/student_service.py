from datetime import datetime
from typing import Any, Optional

from app.domain.entities.student import Student
from app.domain.repositories.student_repository import StudentRepository


class StudentService:
    def __init__(self, student_repo: StudentRepository):
        self.student_repo = student_repo

    async def get_enriched_students(self) -> list[dict[str, Any]]:
        return await self.student_repo.get_enriched_students()

    async def register_student(self, student_data: dict[str, Any]) -> int:
        student = self.student_entity(student_data)
        saved_student = await self.student_repo.save(student)
        return saved_student.id

    async def get_student(self, student_id: int) -> Optional[Student]:
        return await self.student_repo.find_by_id(student_id)

    async def get_all_students(self) -> list[Student]:
        return await self.student_repo.get_all()

    async def update_student(
            self,
            student_id: int,
            student_data: dict[str, Any],
    ) -> Optional[Student]:
        existing_student = await self.student_repo.find_by_id(student_id)

        if existing_student is None:
            return None

        updated_student = Student(
            id=student_id,
            career=student_data.get("career", existing_student.career),
            academic_cycle=student_data.get(
                "academic_cycle",
                existing_student.academic_cycle,
            ),
            weekly_availability=student_data.get(
                "weekly_availability",
                existing_student.weekly_availability,
            ),
            preferred_modality=student_data.get(
                "preferred_modality",
                existing_student.preferred_modality,
            ),
            university=student_data.get(
                "university",
                existing_student.university,
            ),
            embedding=student_data.get(
                "embedding",
                existing_student.embedding,
            ),
            created_at=existing_student.created_at,
            updated_at=datetime.utcnow(),
            deleted_at=existing_student.deleted_at,
        )

        return await self.student_repo.update(updated_student)

    async def delete_student(self, student_id: int) -> bool:
        return await self.student_repo.delete(student_id)

    @staticmethod
    def student_entity(student_data: dict[str, Any]) -> Student:
        now = datetime.utcnow()

        return Student(
            id=0,
            career=student_data["career"],
            academic_cycle=student_data["academic_cycle"],
            weekly_availability=student_data["weekly_availability"],
            preferred_modality=student_data["preferred_modality"],
            university=student_data.get("university"),
            embedding=student_data.get("embedding"),
            created_at=student_data.get("created_at", now),
            updated_at=student_data.get("updated_at", now),
            deleted_at=None,
        )
