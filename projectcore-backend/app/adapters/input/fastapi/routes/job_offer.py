from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.job_offer_schema import (JobOfferCreate, JobOfferResponse, JobOfferUpdate, )
from app.application.factories.job_offer_factory import (JobOfferUseCaseFactory, )
from app.infraestructure.database.connection import get_session

router = APIRouter()


def serialize_job_offer(job_offer) -> dict:
    return JobOfferResponse.model_validate(job_offer, from_attributes=True, ).model_dump(mode="json")


@router.post("/register/job_offer", response_model=dict, tags=["Job Offer"], )
async def register_job_offer(job_offer: JobOfferCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = JobOfferUseCaseFactory(session).build()

        return await use_case.register_job_offer(job_offer.model_dump())

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error


@router.get("/job_offer/all", response_model=List[JobOfferResponse], tags=["Job Offer"], )
async def get_all_job_offers(session: AsyncSession = Depends(get_session), ):
    use_case = JobOfferUseCaseFactory(session).build()
    offers = await use_case.get_all_job_offers()

    return [serialize_job_offer(offer) for offer in offers]


@router.get("/job_offer/{job_offer_id}", response_model=JobOfferResponse, tags=["Job Offer"], )
async def get_job_offer(job_offer_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = JobOfferUseCaseFactory(session).build()
        offer = await use_case.get_job_offer(job_offer_id)

        return serialize_job_offer(offer)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error


@router.get("/company/{company_id}/job_offers", response_model=List[JobOfferResponse], tags=["Job Offer", "Company"], )
async def get_company_job_offers(company_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = JobOfferUseCaseFactory(session).build()
        offers = await use_case.get_company_job_offers(company_id)

        return [serialize_job_offer(offer) for offer in offers]

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error


@router.put("/job_offer/{job_offer_id}", response_model=JobOfferResponse, tags=["Job Offer"], )
async def update_job_offer(job_offer_id: int, job_offer: JobOfferUpdate,
                           session: AsyncSession = Depends(get_session), ):
    try:
        updates = job_offer.model_dump(exclude_unset=True)

        if not updates:
            raise HTTPException(status_code=400, detail="No se recibieron campos para actualizar", )

        use_case = JobOfferUseCaseFactory(session).build()
        updated = await use_case.update_job_offer(job_offer_id, updates, )

        return serialize_job_offer(updated)

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error


@router.delete("/job_offer/{job_offer_id}", response_model=dict, tags=["Job Offer"], )
async def delete_job_offer(job_offer_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = JobOfferUseCaseFactory(session).build()

        return await use_case.delete_job_offer(job_offer_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error
