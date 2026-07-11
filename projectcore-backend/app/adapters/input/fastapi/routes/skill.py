from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.skill_schema import (SkillCreate, SkillResponse, )
from app.application.factories.skill_factory import SkillUseCaseFactory
from app.infraestructure.database.connection import get_session

router = APIRouter()


@router.post("/register/skill", response_model=SkillResponse, tags=["Skill"], )
async def register_skill(skill: SkillCreate, session: AsyncSession = Depends(get_session), ):
    try:
        skill_use_case = SkillUseCaseFactory(session).build()

        skill_id = await skill_use_case.register_skill(skill.model_dump())

        return await skill_use_case.get_skill(skill_id)

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), )


@router.get("/skill/all", response_model=list[SkillResponse], tags=["Skill"], )
async def get_all_skills(session: AsyncSession = Depends(get_session), ):
    try:
        skill_use_case = SkillUseCaseFactory(session).build()
        return await skill_use_case.get_all_skills()

    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", )


@router.get("/skill/{skill_id}", response_model=SkillResponse, tags=["Skill"], )
async def get_skill(skill_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        skill_use_case = SkillUseCaseFactory(session).build()
        return await skill_use_case.get_skill(skill_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )


@router.delete("/skill/{skill_id}", response_model=dict, tags=["Skill"], )
async def delete_skill(skill_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        skill_use_case = SkillUseCaseFactory(session).build()
        return await skill_use_case.delete_skill(skill_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )


@router.get("/skill/name/{skill_id}", response_model=Optional[str], tags=["Skill"], )
async def get_skill_name(skill_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        skill_use_case = SkillUseCaseFactory(session).build()
        return await skill_use_case.get_skill_name_by_id(skill_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )
