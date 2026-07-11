from datetime import datetime
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.company_model import CompanyModel
from app.adapters.output.orm.repositories.job_offer_repository_impl import (JobOfferRepositoryImpl, )
from app.application.ports.job_offer_port import JobOfferPort
from app.domain.entities.job_offer import JobOffer


class JobOfferPortImpl(JobOfferPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.job_offer_repo = JobOfferRepositoryImpl(session)

    async def _company_is_active(self, company_id: int) -> bool:
        result = await self.session.execute(
            select(CompanyModel.id).where(CompanyModel.id == company_id, CompanyModel.deleted_at.is_(None), ))

        return result.scalar_one_or_none() is not None

    async def register_job_offer(self, job_offer_data: dict[str, Any], ) -> JobOffer:
        company_id = job_offer_data["company_id"]

        if not await self._company_is_active(company_id):
            raise ValueError(f"La compañía con ID {company_id} no existe o está eliminada")

        now = datetime.utcnow()

        job_offer = JobOffer(id=0, company_id=company_id, title=job_offer_data["title"],
                             description=job_offer_data["description"], required_hours=job_offer_data["required_hours"],
                             approximated_salary=job_offer_data["approximated_salary"],
                             duration=job_offer_data["duration"],
                             start_date=job_offer_data["start_date"], modality=job_offer_data["modality"],
                             location=job_offer_data.get("location"), embedding=job_offer_data.get("embedding", {}),
                             created_at=job_offer_data.get("created_at", now),
                             updated_at=job_offer_data.get("updated_at", now),
                             deleted_at=None, )

        return await self.job_offer_repo.save(job_offer)

    async def get_enriched_job_offers(self) -> list[dict]:
        return await self.job_offer_repo.get_enriched_job_offers()

    async def get_job_offer(self, job_offer_id: int, ) -> Optional[JobOffer]:
        return await self.job_offer_repo.find_by_id(job_offer_id)

    async def get_job_offers_by_company_id(self, company_id: int, ) -> list[JobOffer]:
        return await self.job_offer_repo.find_by_company_id(company_id)

    async def get_all_job_offers(self) -> list[JobOffer]:
        return await self.job_offer_repo.get_all()

    async def update_job_offer(self, job_offer_id: int, job_offer_data: dict[str, Any], ) -> Optional[JobOffer]:
        existing = await self.job_offer_repo.find_by_id(job_offer_id)

        if existing is None:
            return None

        company_id = job_offer_data.get("company_id", existing.company_id, )

        if not await self._company_is_active(company_id):
            raise ValueError(f"La compañía con ID {company_id} no existe o está eliminada")

        now = datetime.utcnow()

        updated = JobOffer(id=existing.id, company_id=company_id, title=job_offer_data.get("title", existing.title),
                           description=job_offer_data.get("description", existing.description, ),
                           required_hours=job_offer_data.get("required_hours", existing.required_hours, ),
                           approximated_salary=job_offer_data.get("approximated_salary",
                                                                  existing.approximated_salary, ),
                           duration=job_offer_data.get("duration", existing.duration, ),
                           start_date=job_offer_data.get("start_date", existing.start_date, ),
                           modality=job_offer_data.get("modality", existing.modality, ),
                           location=job_offer_data.get("location", existing.location, ),
                           embedding=job_offer_data.get("embedding", existing.embedding, ),
                           created_at=existing.created_at,
                           updated_at=now, deleted_at=existing.deleted_at, )

        return await self.job_offer_repo.update(updated)

    async def delete_job_offer(self, job_offer_id: int) -> bool:
        return await self.job_offer_repo.delete(job_offer_id)

    async def validate_job_offer_data(self, job_offer_data: dict[str, Any], partial: bool = False, ) -> bool:
        required_fields = ("company_id", "title", "description", "required_hours", "approximated_salary", "duration",
                           "start_date", "modality",)

        if not partial:
            for field in required_fields:
                if field not in job_offer_data:
                    return False

        if "company_id" in job_offer_data:
            if not isinstance(job_offer_data["company_id"], int):
                return False
            if job_offer_data["company_id"] <= 0:
                return False

        for field in ("title", "description"):
            if field in job_offer_data:
                value = job_offer_data[field]
                if not isinstance(value, str) or not value.strip():
                    return False

        for field in ("required_hours", "duration"):
            if field in job_offer_data:
                if not isinstance(job_offer_data[field], int):
                    return False
                if job_offer_data[field] <= 0:
                    return False

        if "approximated_salary" in job_offer_data:
            salary = job_offer_data["approximated_salary"]

            if not isinstance(salary, int) or salary < 0:
                return False

        if "modality" in job_offer_data:
            if job_offer_data["modality"] not in (1, 2, 3):
                return False

        return True
