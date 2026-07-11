from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.job_offer_required_skill_schema import (
    JobOfferRequiredSkillCreate,
    JobOfferRequiredSkillResponse,
)
from app.application.factories.job_offer_required_skill_factory import (
    JobOfferRequiredSkillUseCaseFactory,
)
from app.domain.entities.job_offer_required_skill import (
    JobOfferRequiredSkill,
)
from app.infraestructure.database.connection import get_session

router = APIRouter()


@router.post(
    "/job_offer/job_offer_required_skill",
    response_model=JobOfferRequiredSkillResponse,
    tags=["Job Offer", "Skill"],
)
async def add_job_offer_required_skill(
        payload: JobOfferRequiredSkillCreate,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferRequiredSkillUseCaseFactory(
            session
        ).build()

        entity = JobOfferRequiredSkill(
            job_offer_id=payload.job_offer_id,
            skill_id=payload.skill_id,
        )

        result = await use_case.add_job_offer_required_skill(
            entity
        )

        return JobOfferRequiredSkillResponse(
            job_offer_id=result.job_offer_id,
            skill_id=result.skill_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error


@router.get(
    "/job_offer/{job_offer_id}/skills",
    response_model=List[JobOfferRequiredSkillResponse],
    tags=["Job Offer", "Skill"],
)
async def get_job_offer_required_skills(
        job_offer_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferRequiredSkillUseCaseFactory(
            session
        ).build()

        skills = await use_case.get_job_offer_required_skills(
            job_offer_id
        )

        return [
            JobOfferRequiredSkillResponse(
                job_offer_id=skill.job_offer_id,
                skill_id=skill.skill_id,
            )
            for skill in skills
        ]

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error


@router.delete(
    "/job_offer/{job_offer_id}/skill/{skill_id}",
    response_model=dict,
    tags=["Job Offer", "Skill"],
)
async def delete_job_offer_required_skill(
        job_offer_id: int,
        skill_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferRequiredSkillUseCaseFactory(
            session
        ).build()

        return await use_case.delete_job_offer_required_skill(
            job_offer_id,
            skill_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error
