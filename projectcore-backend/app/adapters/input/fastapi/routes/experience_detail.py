from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.experience_detail_schema import (ExperienceDetailCreate,
                                                                         ExperienceDetailResponse, )
from app.application.factories.experience_detail_factory import (ExperienceDetailUseCaseFactory, )
from app.infraestructure.database.connection import get_session

router = APIRouter()


def serialize_experience_detail(experience_detail):
    return ExperienceDetailResponse.model_validate(experience_detail, from_attributes=True, ).model_dump()


@router.post("/register/experience_detail", response_model=dict, tags=["Experience Detail"], )
async def register_experience_detail(experience_detail: ExperienceDetailCreate,
                                     session: AsyncSession = Depends(get_session), ):
    try:
        use_case = ExperienceDetailUseCaseFactory(session).build()

        return await use_case.register_experience_detail(experience_detail.model_dump())

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/experience_detail/all", response_model=list[dict], tags=["Experience Detail"], )
async def get_all_experience_details(session: AsyncSession = Depends(get_session), ):
    use_case = ExperienceDetailUseCaseFactory(session).build()
    experiences = await use_case.get_all_experience_details()

    return [serialize_experience_detail(experience) for experience in experiences]


@router.get("/experience_detail/{experience_detail_id}", response_model=dict, tags=["Experience Detail"], )
async def get_experience_detail(experience_detail_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = ExperienceDetailUseCaseFactory(session).build()
        experience = await use_case.get_experience_detail(experience_detail_id)

        if experience is None:
            raise ValueError("Experiencia no encontrada")

        return serialize_experience_detail(experience)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/student/{student_id}/experience_details", response_model=list[dict],
            tags=["Experience Detail", "Student"], )
async def get_student_experience_details(student_id: int, session: AsyncSession = Depends(get_session), ):
    use_case = ExperienceDetailUseCaseFactory(session).build()

    experiences = await use_case.get_student_experience_details(student_id)

    return [serialize_experience_detail(experience) for experience in experiences]


@router.get("/job_offer/{job_offer_id}/experience_details", response_model=list[dict],
            tags=["Experience Detail", "Job Offer"], )
async def get_job_offer_experience_details(job_offer_id: int, session: AsyncSession = Depends(get_session), ):
    use_case = ExperienceDetailUseCaseFactory(session).build()

    experiences = await use_case.get_job_offer_experience_details(job_offer_id)

    return [serialize_experience_detail(experience) for experience in experiences]


@router.put("/experience_detail/{experience_detail_id}", response_model=dict, tags=["Experience Detail"], )
async def update_experience_detail(experience_detail_id: int, experience_detail: ExperienceDetailCreate,
                                   session: AsyncSession = Depends(get_session), ):
    try:
        use_case = ExperienceDetailUseCaseFactory(session).build()

        updated = await use_case.update_experience_detail(experience_detail_id, experience_detail.model_dump(), )

        return serialize_experience_detail(updated)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.delete("/experience_detail/{experience_detail_id}", response_model=dict, tags=["Experience Detail"], )
async def delete_experience_detail(experience_detail_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = ExperienceDetailUseCaseFactory(session).build()

        return await use_case.delete_experience_detail(experience_detail_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
