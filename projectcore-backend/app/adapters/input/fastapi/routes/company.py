import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.company_schema import (CompanyCreate, CompanyResponse, CompanyUpdate, )
from app.application.factories.company_factory import CompanyUseCaseFactory
from app.infraestructure.database.connection import get_session

router = APIRouter()
logger = logging.getLogger(__name__)


def serialize_company(company) -> dict:
    return CompanyResponse.model_validate(company, from_attributes=True, ).model_dump(mode="json")


@router.post("/register/company", response_model=dict, tags=["Company"], )
async def register_company(company: CompanyCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = CompanyUseCaseFactory(session).build()

        return await use_case.register_company(company.model_dump())

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al registrar empresa", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.get("/company/all", response_model=List[CompanyResponse], tags=["Company"], )
async def get_all_companies(session: AsyncSession = Depends(get_session), ):
    try:
        use_case = CompanyUseCaseFactory(session).build()
        companies = await use_case.get_all_companies()

        return [serialize_company(company) for company in companies]

    except Exception as error:
        logger.error("Error al obtener empresas", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.get("/company/{company_id}", response_model=CompanyResponse, tags=["Company"], )
async def get_company_by_id(company_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = CompanyUseCaseFactory(session).build()
        company = await use_case.get_company(company_id)

        return serialize_company(company)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al obtener empresa", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.put("/company/{company_id}", response_model=CompanyResponse, tags=["Company"], )
async def update_company(company_id: int, company: CompanyUpdate, session: AsyncSession = Depends(get_session), ):
    try:
        updates = company.model_dump(exclude_unset=True)

        if not updates:
            raise HTTPException(status_code=400, detail="No se recibieron campos para actualizar", )

        use_case = CompanyUseCaseFactory(session).build()
        updated_company = await use_case.update_company(company_id, updates, )

        return serialize_company(updated_company)

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al actualizar empresa", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.delete("/company/{company_id}", response_model=dict, tags=["Company"], )
async def delete_company(company_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = CompanyUseCaseFactory(session).build()

        return await use_case.delete_company(company_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al eliminar empresa", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error
