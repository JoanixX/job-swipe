from typing import Any

from app.application.ports.match_job_student_port import (
    MatchJobStudentPort,
)
from app.domain.services.match_job_student_service import (
    MatchJobStudentService,
)


class MatchJobStudentUseCase:
    def __init__(
            self,
            match_js_port: MatchJobStudentPort,
            match_js_service: MatchJobStudentService,
    ):
        self.match_js_port = match_js_port
        self.match_js_service = match_js_service

    async def register_match_job_student(
            self,
            match_job_student: dict[str, Any],
    ) -> dict[str, Any]:
        match_id = await self.match_js_service.register_match_job_student(
            match_job_student
        )

        return {
            "match_job_student_id": match_id,
            "registration_success": True,
            "message": "Match registrado exitosamente",
        }

    async def match_job_students(
            self,
            student_id: int,
    ):
        if student_id <= 0:
            raise ValueError(
                "El ID del estudiante debe ser positivo"
            )

        return await self.match_js_port.match_job_student(
            student_id
        )

    async def match_student_jobs(
            self,
            job_offer_id: int,
    ):
        if job_offer_id <= 0:
            raise ValueError(
                "El ID de la oferta debe ser positivo"
            )

        return await self.match_js_port.match_student_job(
            job_offer_id
        )
