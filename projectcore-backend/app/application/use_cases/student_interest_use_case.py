from typing import Any

from app.domain.entities.student_interest import StudentInterest
from app.domain.services.student_interest_service import (
    StudentInterestService,
)


class StudentInterestUseCase:
    def __init__(
            self,
            student_interest_port,
            student_interest_service: StudentInterestService,
    ):
        self.student_interest_port = student_interest_port
        self.student_interest_service = student_interest_service

    async def get_student_interests(
            self,
            student_id: int,
    ) -> list[StudentInterest]:
        return await self.student_interest_service.get_student_interests(
            student_id
        )

    async def add_student_interest(
            self,
            student_interest: StudentInterest,
    ) -> StudentInterest:
        return await self.student_interest_service.add_student_interest(
            student_interest
        )

    async def delete_student_interest(
            self,
            student_id: int,
            interest_id: int,
    ) -> dict[str, Any]:
        deleted = (
            await self.student_interest_service.delete_student_interest(
                student_id,
                interest_id,
            )
        )

        if not deleted:
            raise ValueError(
                f"El interés {interest_id} no está asociado "
                f"al estudiante {student_id}"
            )

        return {
            "message": "Interés eliminado exitosamente del estudiante"
        }