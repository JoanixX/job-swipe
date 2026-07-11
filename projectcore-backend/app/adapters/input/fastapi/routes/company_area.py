from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.company_area_schema import (
    CompanyAreaCreate,
    CompanyAreaResponse,
)
from app.application.factories.company_area_factory import (
    CompanyAreaUseCaseFactory,
)
from app.domain.entities.company_area import CompanyArea
from app.infraestructure.database.connection import get_session

router = APIRouter()


@router.post(
    "/company/company_area",
    response_model=CompanyAreaResponse,
    tags=["Company", "Area"],
)
async def add_company_area(
        payload: CompanyAreaCreate,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = CompanyAreaUseCaseFactory(session).build()

        company_area = CompanyArea(
            company_id=payload.company_id,
            area_id=payload.area_id,
        )

        result = await use_case.add_company_area(company_area)

        return CompanyAreaResponse(
            company_id=result.company_id,
            area_id=result.area_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error


@router.get(
    "/company/{company_id}/areas",
    response_model=List[CompanyAreaResponse],
    tags=["Company", "Area"],
)
async def get_company_areas(
        company_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = CompanyAreaUseCaseFactory(session).build()
        areas = await use_case.get_company_areas(company_id)

        return [
            CompanyAreaResponse(
                company_id=area.company_id,
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
    "/company/{company_id}/area/{area_id}",
    response_model=dict,
    tags=["Company", "Area"],
)
async def delete_company_area(
        company_id: int,
        area_id: int,
        session: AsyncSession = Depends(get_session),
):
    try:
        use_case = CompanyAreaUseCaseFactory(session).build()

        return await use_case.delete_company_area(
            company_id,
            area_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error
