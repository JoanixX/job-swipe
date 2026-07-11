from typing import Any

from app.application.ports.job_offer_port import JobOfferPort
from app.domain.entities.job_offer import JobOffer
from app.domain.services.job_offer_service import JobOfferService


class JobOfferUseCase:
    def __init__(self, job_offer_port: JobOfferPort, job_offer_service: JobOfferService, ):
        self.job_offer_port = job_offer_port
        self.job_offer_service = job_offer_service

    async def get_enriched_job_offers(self) -> list[dict]:
        return await self.job_offer_port.get_enriched_job_offers()

    async def register_job_offer(self, job_offer_data: dict[str, Any], ) -> dict[str, Any]:
        valid = await self.job_offer_port.validate_job_offer_data(job_offer_data, partial=False, )

        if not valid:
            raise ValueError("Datos de oferta de trabajo inválidos")

        job_offer_id = await self.job_offer_service.register_job_offer(job_offer_data)

        return {"id": job_offer_id, "registration_success": True,
                "message": "Oferta de trabajo registrada exitosamente", }

    async def get_job_offer(self, job_offer_id: int) -> JobOffer:
        if job_offer_id <= 0:
            raise ValueError("El ID de la oferta debe ser positivo")

        job_offer = await self.job_offer_port.get_job_offer(job_offer_id)

        if job_offer is None:
            raise ValueError(f"Oferta de trabajo con ID {job_offer_id} no encontrada")

        return job_offer

    async def get_company_job_offers(self, company_id: int, ) -> list[JobOffer]:
        if company_id <= 0:
            raise ValueError("El ID de la compañía debe ser positivo")

        return await self.job_offer_port.get_job_offers_by_company_id(company_id)

    async def get_all_job_offers(self) -> list[JobOffer]:
        return await self.job_offer_port.get_all_job_offers()

    async def update_job_offer(self, job_offer_id: int, job_offer_data: dict[str, Any], ) -> JobOffer:
        if not job_offer_data:
            raise ValueError("No se recibieron campos para actualizar")

        valid = await self.job_offer_port.validate_job_offer_data(job_offer_data, partial=True, )

        if not valid:
            raise ValueError("Datos de oferta de trabajo inválidos")

        job_offer = await self.get_job_offer(job_offer_id)

        updated = await self.job_offer_port.update_job_offer(job_offer.id, job_offer_data, )

        if updated is None:
            raise ValueError(f"Error al actualizar la oferta con ID {job_offer_id}")

        return updated

    async def delete_job_offer(self, job_offer_id: int, ) -> dict[str, str]:
        await self.get_job_offer(job_offer_id)

        deleted = await self.job_offer_port.delete_job_offer(job_offer_id)

        if not deleted:
            raise ValueError(f"Error al eliminar la oferta con ID {job_offer_id}")

        return {"message": "Oferta de trabajo eliminada exitosamente", }
