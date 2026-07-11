from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.area_model import AreaModel
from app.adapters.output.orm.models.experience_detail_model import (ExperienceDetailModel, )
from app.adapters.output.orm.models.job_offer_area_model import (JobOfferAreaModel, )
from app.adapters.output.orm.models.job_offer_model import JobOfferModel
from app.adapters.output.orm.models.job_offer_required_skill_model import (JobOfferRequiredSkillModel, )
from app.adapters.output.orm.models.skill_model import SkillModel
from app.domain.entities.job_offer import JobOffer
from app.domain.repositories.job_offer_repository import JobOfferRepository


class JobOfferRepositoryImpl(JobOfferRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _active_filter():
        return JobOfferModel.deleted_at.is_(None)

    @staticmethod
    def _to_entity(model: JobOfferModel) -> JobOffer:
        return JobOffer(id=model.id, company_id=model.company_id, title=model.title, description=model.description,
                        required_hours=model.required_hours, approximated_salary=model.approximated_salary,
                        duration=model.duration,
                        start_date=model.start_date, modality=model.modality, location=model.location,
                        embedding=model.embedding,
                        created_at=model.created_at, updated_at=model.updated_at, deleted_at=model.deleted_at, )

    async def save(self, job_offer: JobOffer) -> JobOffer:
        now = datetime.utcnow()

        model = JobOfferModel(company_id=job_offer.company_id, title=job_offer.title, description=job_offer.description,
                              required_hours=job_offer.required_hours,
                              approximated_salary=job_offer.approximated_salary,
                              duration=job_offer.duration, start_date=job_offer.start_date, modality=job_offer.modality,
                              location=job_offer.location, embedding=job_offer.embedding,
                              created_at=job_offer.created_at or now,
                              updated_at=job_offer.updated_at or now, deleted_at=job_offer.deleted_at, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(self, job_offer_id: int, ) -> Optional[JobOffer]:
        statement = select(JobOfferModel).where(JobOfferModel.id == job_offer_id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        return self._to_entity(model) if model else None

    async def find_by_company_id(self, company_id: int, ) -> list[JobOffer]:
        statement = (
            select(JobOfferModel).where(JobOfferModel.company_id == company_id, self._active_filter(), ).order_by(
                JobOfferModel.created_at.desc()))

        result = await self.session.execute(statement)

        return [self._to_entity(model) for model in result.scalars().all()]

    async def get_all(self) -> list[JobOffer]:
        statement = (select(JobOfferModel).where(self._active_filter()).order_by(JobOfferModel.created_at.desc()))

        result = await self.session.execute(statement)

        return [self._to_entity(model) for model in result.scalars().all()]

    async def update(self, job_offer: JobOffer, ) -> Optional[JobOffer]:
        statement = select(JobOfferModel).where(JobOfferModel.id == job_offer.id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return None

        model.company_id = job_offer.company_id
        model.title = job_offer.title
        model.description = job_offer.description
        model.required_hours = job_offer.required_hours
        model.approximated_salary = job_offer.approximated_salary
        model.duration = job_offer.duration
        model.start_date = job_offer.start_date
        model.modality = job_offer.modality
        model.location = job_offer.location
        model.embedding = job_offer.embedding
        model.updated_at = job_offer.updated_at or datetime.utcnow()

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def delete(self, job_offer_id: int) -> bool:
        statement = select(JobOfferModel).where(JobOfferModel.id == job_offer_id, self._active_filter(), )

        result = await self.session.execute(statement)
        model = result.scalar_one_or_none()

        if model is None:
            return False

        now = datetime.utcnow()
        model.deleted_at = now
        model.updated_at = now

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True

    async def get_enriched_job_offers(self) -> list[dict]:
        offers = await self.get_all()
        enriched_offers = []

        for offer in offers:
            skills_result = await self.session.execute(select(SkillModel.name).join(JobOfferRequiredSkillModel,
                                                                                    JobOfferRequiredSkillModel.skill_id == SkillModel.id, ).where(
                JobOfferRequiredSkillModel.job_offer_id == offer.id).order_by(SkillModel.name))

            areas_result = await self.session.execute(
                select(AreaModel.name).join(JobOfferAreaModel, JobOfferAreaModel.area_id == AreaModel.id, ).where(
                    JobOfferAreaModel.job_offer_id == offer.id).order_by(AreaModel.name))

            experiences_result = await self.session.execute(
                select(ExperienceDetailModel.name, ExperienceDetailModel.description, ).where(
                    ExperienceDetailModel.job_offer_id == offer.id,
                    ExperienceDetailModel.deleted_at.is_(None), ).order_by(ExperienceDetailModel.created_at.desc()))

            enriched_offers.append(
                {"id": offer.id, "company_id": offer.company_id, "title": offer.title, "description": offer.description,
                 "required_hours": offer.required_hours, "approximated_salary": offer.approximated_salary,
                 "duration": offer.duration, "start_date": offer.start_date, "modality": offer.modality,
                 "location": offer.location, "embedding": offer.embedding,
                 "required_skills": [{"name": name} for name in skills_result.scalars().all()],
                 "areas": [{"name": name} for name in areas_result.scalars().all()],
                 "experience_details": [{"name": name, "description": description, } for name, description in
                                        experiences_result.all()], })

        return enriched_offers
