from datetime import datetime
from typing import Any, Optional

from app.domain.entities.experience_detail import ExperienceDetail
from app.domain.repositories.experience_detail_repository import (ExperienceDetailRepository, )


class ExperienceDetailService:
    def __init__(self, experience_detail_repo: ExperienceDetailRepository):
        self.experience_detail_repo = experience_detail_repo

    @staticmethod
    def _validate_data(data: dict[str, Any]) -> None:
        student_id = data.get("student_id")
        job_offer_id = data.get("job_offer_id")

        if student_id is None and job_offer_id is None:
            raise ValueError("Debe indicar student_id o job_offer_id")

        if student_id is not None and student_id <= 0:
            raise ValueError("student_id debe ser mayor que cero")

        if job_offer_id is not None and job_offer_id <= 0:
            raise ValueError("job_offer_id debe ser mayor que cero")

        if not isinstance(data.get("name"), str) or not data["name"].strip():
            raise ValueError("El nombre es obligatorio")

        if (not isinstance(data.get("description"), str) or not data["description"].strip()):
            raise ValueError("La descripción es obligatoria")

        if (not isinstance(data.get("duration_in_months"), int) or data["duration_in_months"] <= 0):
            raise ValueError("duration_in_months debe ser mayor que cero")

    async def register_experience_detail(self, experience_detail_data: dict[str, Any], ) -> int:
        self._validate_data(experience_detail_data)

        experience_detail = ExperienceDetail(id=0, student_id=experience_detail_data.get("student_id"),
                                             job_offer_id=experience_detail_data.get("job_offer_id"),
                                             name=experience_detail_data["name"].strip(),
                                             description=experience_detail_data["description"].strip(),
                                             duration_in_months=experience_detail_data["duration_in_months"], )

        saved = await self.experience_detail_repo.save(experience_detail)
        return saved.id

    async def get_experience_detail(self, experience_detail_id: int, ) -> Optional[ExperienceDetail]:
        if experience_detail_id <= 0:
            raise ValueError("El ID debe ser mayor que cero")

        return await self.experience_detail_repo.find_by_id(experience_detail_id)

    async def get_all_experience_details(self) -> list[ExperienceDetail]:
        return await self.experience_detail_repo.get_all()

    async def get_student_experience_details(self, student_id: int, ) -> list[ExperienceDetail]:
        if student_id <= 0:
            raise ValueError("student_id debe ser mayor que cero")

        return await self.experience_detail_repo.find_by_student_id(student_id)

    async def get_job_offer_experience_details(self, job_offer_id: int, ) -> list[ExperienceDetail]:
        if job_offer_id <= 0:
            raise ValueError("job_offer_id debe ser mayor que cero")

        return await self.experience_detail_repo.find_by_job_offer_id(job_offer_id)

    async def update_experience_detail(self, experience_detail_id: int, data: dict[str, Any], ) -> Optional[
        ExperienceDetail]:
        existing = await self.get_experience_detail(experience_detail_id)

        if existing is None:
            return None

        updated_data = {"student_id": data.get("student_id", existing.student_id),
                        "job_offer_id": data.get("job_offer_id", existing.job_offer_id, ),
                        "name": data.get("name", existing.name),
                        "description": data.get("description", existing.description, ),
                        "duration_in_months": data.get("duration_in_months", existing.duration_in_months, ), }

        self._validate_data(updated_data)

        updated = ExperienceDetail(id=existing.id, student_id=updated_data["student_id"],
                                   job_offer_id=updated_data["job_offer_id"], name=updated_data["name"].strip(),
                                   description=updated_data["description"].strip(),
                                   duration_in_months=updated_data["duration_in_months"],
                                   created_at=existing.created_at, updated_at=datetime.utcnow(),
                                   deleted_at=existing.deleted_at, )

        return await self.experience_detail_repo.update(updated)

    async def delete_experience_detail(self, experience_detail_id: int, ) -> bool:
        return await self.experience_detail_repo.delete(experience_detail_id)
