from typing import Any

from app.domain.entities.student_skill import StudentSkill
from app.domain.services.student_skill_service import StudentSkillService


class StudentSkillUseCase:
    def __init__(
            self,
            student_skill_port,
            student_skill_service: StudentSkillService,
    ):
        self.student_skill_port = student_skill_port
        self.student_skill_service = student_skill_service

    async def get_student_skills(
            self,
            student_id: int,
    ) -> list[StudentSkill]:
        return await self.student_skill_service.get_student_skills(
            student_id
        )

    async def add_student_skill(
            self,
            student_skill: StudentSkill,
    ) -> StudentSkill:
        return await self.student_skill_service.add_student_skill(
            student_skill
        )

    async def delete_student_skill(
            self,
            student_id: int,
            skill_id: int,
    ) -> dict[str, Any]:
        deleted = await self.student_skill_service.delete_student_skill(
            student_id,
            skill_id,
        )

        if not deleted:
            raise ValueError(
                f"La habilidad {skill_id} no está asociada "
                f"al estudiante {student_id}"
            )

        return {
            "message": "Habilidad eliminada exitosamente del estudiante"
        }