from typing import List

from app.domain.entities.student_interest import StudentInterest
from app.domain.repositories.student_interest_repository import (StudentInterestRepository, )


class StudentInterestService:
    def __init__(self, student_interest_repo: StudentInterestRepository, ):
        self.student_interest_repo = student_interest_repo

    async def add_student_interest(self, student_interest: StudentInterest, ) -> StudentInterest:
        if (student_interest.student_id <= 0 or student_interest.interest_id <= 0):
            raise ValueError("Los IDs deben ser mayores que cero")

        if await self.student_interest_repo.exists(student_interest.student_id, student_interest.interest_id, ):
            raise ValueError("El estudiante ya tiene este interés asignado")

        return await self.student_interest_repo.save(student_interest)

    async def get_student_interests(self, student_id: int, ) -> List[StudentInterest]:
        if student_id <= 0:
            raise ValueError("El ID del estudiante debe ser válido")

        return await self.student_interest_repo.get_by_student_id(student_id)

    async def delete_student_interest(self, student_id: int, interest_id: int, ) -> bool:
        if student_id <= 0 or interest_id <= 0:
            raise ValueError("Los IDs deben ser mayores que cero")

        return await self.student_interest_repo.delete(student_id, interest_id, )
