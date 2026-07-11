from typing import List

from app.domain.entities.student_skill import StudentSkill
from app.domain.repositories.student_skill_repository import (StudentSkillRepository, )


class StudentSkillService:
    def __init__(self, student_skill_repo: StudentSkillRepository):
        self.student_skill_repo = student_skill_repo

    async def add_student_skill(self, student_skill: StudentSkill, ) -> StudentSkill:
        if student_skill.student_id <= 0 or student_skill.skill_id <= 0:
            raise ValueError("Los IDs deben ser mayores que cero")

        if await self.student_skill_repo.exists(student_skill.student_id, student_skill.skill_id, ):
            raise ValueError("El estudiante ya tiene esta habilidad asignada")

        return await self.student_skill_repo.save(student_skill)

    async def get_student_skills(self, student_id: int, ) -> List[StudentSkill]:
        if student_id <= 0:
            raise ValueError("El ID del estudiante debe ser válido")

        return await self.student_skill_repo.get_by_student_id(student_id)

    async def delete_student_skill(self, student_id: int, skill_id: int, ) -> bool:
        if student_id <= 0 or skill_id <= 0:
            raise ValueError("Los IDs deben ser mayores que cero")

        return await self.student_skill_repo.delete(student_id, skill_id, )
