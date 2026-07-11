from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.job_offer_area_schema import (
    JobOfferAreaCreate,
    JobOfferAreaResponse,
)
from app.application.factories.job_offer_area_factory import (
    JobOfferAreaUseCaseFactory,
)
from app.domain.entities.job_offer_area import JobOfferArea
from app.infraestructure.database.connection import get_session

router = APIRouter()


@router.post(
    "/job_offer/job_offer_area",
    response_model=JobOfferAreaResponse,
    tags=["Job Offer", "Area"],
)
async def add_job_offer_area(
        payload: JobOfferAreaCreate,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferAreaUseCaseFactory(session).build()

        job_offer_area = JobOfferArea(
            job_offer_id=payload.job_offer_id,
            area_id=payload.area_id,
        )

        result = await use_case.add_job_offer_area(
            job_offer_area
        )

        return JobOfferAreaResponse(
            job_offer_id=result.job_offer_id,
            area_id=result.area_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error


@router.get(
    "/job_offer/{job_offer_id}/areas",
    response_model=List[JobOfferAreaResponse],
    tags=["Job Offer", "Area"],
)
async def get_job_offer_areas(
        job_offer_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferAreaUseCaseFactory(session).build()
        areas = await use_case.get_job_offer_areas(job_offer_id)

        return [
            JobOfferAreaResponse(
                job_offer_id=area.job_offer_id,
                area_id=area.area_id,
            )
            for area in areas
        ]

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error


@router.delete(
    "/job_offer/{job_offer_id}/area/{area_id}",
    response_model=dict,
    tags=["Job Offer", "Area"],
)
async def delete_job_offer_area(
        job_offer_id: int,
        area_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = JobOfferAreaUseCaseFactory(session).build()

        return await use_case.delete_job_offer_area(
            job_offer_id,
            area_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error
