from typing import Any

from app.domain.entities.experience_detail import ExperienceDetail
from app.domain.services.experience_detail_service import (
    ExperienceDetailService,
)


class ExperienceDetailUseCase:
    def __init__(
            self,
            experience_detail_port,
            experience_detail_service: ExperienceDetailService,
    ):
        self.experience_detail_port = experience_detail_port
        self.experience_detail_service = experience_detail_service

    async def register_experience_detail(
            self,
            experience_detail_data: dict[str, Any],
    ) -> dict[str, Any]:
        experience_detail_id = (
            await self.experience_detail_service
            .register_experience_detail(experience_detail_data)
        )

        if not experience_detail_id:
            raise ValueError("Error al guardar la experiencia")

        return {
            "id": experience_detail_id,
            "registration_success": True,
            "message": "Experiencia registrada exitosamente",
        }

    async def get_experience_detail(
            self,
            experience_detail_id: int,
    ) -> ExperienceDetail:
        experience_detail = (
            await self.experience_detail_service
            .get_experience_detail(experience_detail_id)
        )

        if experience_detail is None:
            raise ValueError(
                f"Experiencia con ID {experience_detail_id} "
                "no encontrada"
            )

        return experience_detail

    async def get_student_experience_details(
            self,
            student_id: int,
    ) -> list[ExperienceDetail]:
        return await (
            self.experience_detail_service
            .get_student_experience_details(student_id)
        )

    async def get_job_offer_experience_details(
            self,
            job_offer_id: int,
    ) -> list[ExperienceDetail]:
        return await (
            self.experience_detail_service
            .get_job_offer_experience_details(job_offer_id)
        )

    async def get_all_experience_details(
            self,
    ) -> list[ExperienceDetail]:
        return await (
            self.experience_detail_service
            .get_all_experience_details()
        )

    async def update_experience_detail(
            self,
            experience_detail_id: int,
            experience_detail_data: dict[str, Any],
    ) -> ExperienceDetail:
        updated_experience_detail = (
            await self.experience_detail_service
            .update_experience_detail(
                experience_detail_id,
                experience_detail_data,
            )
        )

        if updated_experience_detail is None:
            raise ValueError(
                f"Experiencia con ID {experience_detail_id} "
                "no encontrada"
            )

        return updated_experience_detail

    async def delete_experience_detail(
            self,
            experience_detail_id: int,
    ) -> dict[str, Any]:
        experience_detail = (
            await self.experience_detail_service
            .get_experience_detail(experience_detail_id)
        )

        if experience_detail is None:
            raise ValueError(
                f"Experiencia con ID {experience_detail_id} "
                "no encontrada"
            )

        deleted = (
            await self.experience_detail_service
            .delete_experience_detail(experience_detail_id)
        )

        if not deleted:
            raise ValueError(
                f"Error al eliminar la experiencia con ID "
                f"{experience_detail_id}"
            )

        return {
            "message": "Experiencia eliminada exitosamente",
        }