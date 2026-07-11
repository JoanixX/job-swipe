from datetime import datetime
from typing import Any, Optional

from app.domain.entities.job_offer import JobOffer
from app.domain.repositories.job_offer_repository import JobOfferRepository


class JobOfferService:
    def __init__(self, job_offer_repo: JobOfferRepository):
        self.job_offer_repo = job_offer_repo

    async def get_enriched_job_offers(self) -> list[dict]:
        return await self.job_offer_repo.get_enriched_job_offers()

    async def register_job_offer(
            self,
            job_offer_data: dict[str, Any],
    ) -> int:
        job_offer = self.job_offer_entity(job_offer_data)
        saved_offer = await self.job_offer_repo.save(job_offer)

        if saved_offer is None:
            raise ValueError("Error al guardar la oferta de trabajo")

        return saved_offer.id

    async def get_job_offer(
            self,
            job_offer_id: int,
    ) -> Optional[JobOffer]:
        return await self.job_offer_repo.find_by_id(job_offer_id)

    async def get_all_job_offers(self) -> list[JobOffer]:
        return await self.job_offer_repo.get_all()

    async def update_job_offer(
            self,
            job_offer_id: int,
            job_offer_data: dict[str, Any],
    ) -> Optional[JobOffer]:
        existing = await self.job_offer_repo.find_by_id(job_offer_id)

        if existing is None:
            return None

        updated = JobOffer(
            id=existing.id,
            company_id=job_offer_data.get(
                "company_id",
                existing.company_id,
            ),
            title=job_offer_data.get("title", existing.title),
            description=job_offer_data.get(
                "description",
                existing.description,
            ),
            required_hours=job_offer_data.get(
                "required_hours",
                existing.required_hours,
            ),
            approximated_salary=job_offer_data.get(
                "approximated_salary",
                existing.approximated_salary,
            ),
            duration=job_offer_data.get(
                "duration",
                existing.duration,
            ),
            start_date=job_offer_data.get(
                "start_date",
                existing.start_date,
            ),
            modality=job_offer_data.get(
                "modality",
                existing.modality,
            ),
            location=job_offer_data.get(
                "location",
                existing.location,
            ),
            embedding=job_offer_data.get(
                "embedding",
                existing.embedding,
            ),
            created_at=existing.created_at,
            updated_at=datetime.utcnow(),
            deleted_at=existing.deleted_at,
        )

        return await self.job_offer_repo.update(updated)

    async def delete_job_offer(self, job_offer_id: int) -> bool:
        return await self.job_offer_repo.delete(job_offer_id)

    @staticmethod
    def job_offer_entity(
            job_offer_data: dict[str, Any],
    ) -> JobOffer:
        now = datetime.utcnow()

        return JobOffer(
            id=0,
            company_id=job_offer_data["company_id"],
            title=job_offer_data["title"],
            description=job_offer_data["description"],
            required_hours=job_offer_data["required_hours"],
            approximated_salary=job_offer_data["approximated_salary"],
            duration=job_offer_data["duration"],
            start_date=job_offer_data["start_date"],
            modality=job_offer_data["modality"],
            location=job_offer_data.get("location"),
            embedding=job_offer_data.get("embedding", {}),
            created_at=job_offer_data.get("created_at", now),
            updated_at=job_offer_data.get("updated_at", now),
            deleted_at=None,
        )