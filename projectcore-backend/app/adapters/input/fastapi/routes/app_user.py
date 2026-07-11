import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.app_user_schema import (AppUserCreate, AppUserResponse, AppUserUpdate,
                                                                LoginCreate, UpdatePasswordCreate, )
from app.application.factories.app_user_factory import AppUserUseCaseFactory
from app.infraestructure.database.connection import get_session

router = APIRouter()

logger = logging.getLogger(__name__)


def serialize_user(user) -> dict:
    data = {"id": user.id, "email": user.email, "dni": user.dni, "name": user.name, "location": user.location,
            "role": user.role.value if hasattr(user.role, "value") else user.role, "related_id": user.related_id,
            "cv_url": user.cv_url, "date_of_birth": user.date_of_birth, "main_motivation": user.main_motivation,
            "description": user.description, "ruc": user.ruc, "phone": user.phone, "linkedin": user.linkedin,
            "portfolio": user.portfolio, }

    return AppUserResponse.model_validate(data).model_dump(mode="json")


@router.post("/register/user", response_model=dict, tags=["App User"], )
async def register_user(app_user: AppUserCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()

        return await use_case.register_user(app_user.model_dump())

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al registrar usuario", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.get("/user/{app_user_email}", response_model=AppUserResponse, tags=["App User"], )
async def get_user_by_email(app_user_email: str, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()
        user = await use_case.get_user_by_email(app_user_email)

        return serialize_user(user)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al obtener usuario", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.post("/login", response_model=dict, tags=["App User"], )
async def login(credentials: LoginCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()

        return await use_case.login(credentials.email, credentials.password, session, )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al iniciar sesión", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.put("/user/{user_id}", response_model=AppUserResponse, tags=["App User"], )
async def update_user(user_id: int, payload: AppUserUpdate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()

        updated_user = await use_case.update_user(user_id, payload.model_dump(exclude_unset=True), )

        return serialize_user(updated_user)

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al actualizar usuario", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.put("/user/{user_id}/password", response_model=dict, tags=["App User"], )
async def update_password(user_id: int, payload: UpdatePasswordCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()

        return await use_case.update_password(user_id, payload.current_password, payload.new_password, session, )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al actualizar contraseña", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error


@router.delete("/user/{user_id}", response_model=dict, tags=["App User"], )
async def delete_account(user_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = AppUserUseCaseFactory(session).build()

        return await use_case.delete_account(user_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al eliminar usuario", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error
