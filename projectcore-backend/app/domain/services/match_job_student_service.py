from datetime import datetime
from typing import Any

from app.domain.entities.match_job_student import MatchJobStudent
from app.domain.repositories.match_job_student_repository import (
    MatchJobStudentRepository,
)


class MatchJobStudentService:
    def __init__(
            self,
            match_js_repo: MatchJobStudentRepository,
            session=None,
    ):
        self.match_js_repo = match_js_repo
        self.session = session

    async def register_match_job_student(
        self,
            match_data: dict[str, Any],
    ) -> int:
        student_id = match_data.get("student_id")
        job_offer_id = match_data.get("job_offer_id")

        if not isinstance(student_id, int) or student_id <= 0:
            raise ValueError("El ID del estudiante debe ser positivo")

        if not isinstance(job_offer_id, int) or job_offer_id <= 0:
            raise ValueError(
                "El ID de la oferta debe ser positivo"
            )

        score = match_data.get("score")
        rank = match_data.get("rank")

        if score is None or not 0 <= float(score) <= 1:
            raise ValueError(
                "El score debe estar entre 0 y 1"
            )

        if not isinstance(rank, int) or rank <= 0:
            raise ValueError("El rank debe ser positivo")

        existing = await self.match_js_repo.find_by_student_and_offer(
            student_id,
            job_offer_id,
        )

        if existing is not None:
            raise ValueError(
                "Ya existe un match entre el estudiante "
                "y la oferta"
            )

        match_date = match_data.get(
            "match_date",
            datetime.utcnow(),
        )

        entity = MatchJobStudent(
            id=0,
            student_id=student_id,
            job_offer_id=job_offer_id,
            score=float(score),
            match_date=match_date,
            rank=rank,
            student_liked=match_data.get("student_liked"),
            company_liked=match_data.get("company_liked"),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        saved = await self.match_js_repo.save(entity)

        if saved is None:
            raise ValueError("Error al guardar el match")

        return saved.id
