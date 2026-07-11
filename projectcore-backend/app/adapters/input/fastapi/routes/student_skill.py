from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.infraestructure.database.connection import get_session

from app.domain.entities.student_skill import StudentSkill
from app.adapters.input.fastapi.schemas.student_skill_schema import (StudentSkillResponse, StudentSkillCreate, StudentSkillByNameCreate)
from app.application.factories.student_skill_factory import StudentSkillUseCaseFactory
from app.application.factories.skill_factory import SkillUseCaseFactory

router = APIRouter()
# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/student/student_skill", response_model=StudentSkillResponse, tags=["Student", "Skill"])
async def add_student_skill(request: Request, student_skill: StudentSkillCreate, session: AsyncSession = Depends(get_session)):
    try:
        student_skill_use_case = StudentSkillUseCaseFactory(session).build()

        student_skill  = StudentSkill(
            student_id=student_skill.student_id,
            skill_id=student_skill.skill_id
        )

        result = await student_skill_use_case.add_student_skill(student_skill)
        return StudentSkillResponse(student_id=result.student_id, skill_id=result.skill_id)
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error al agregar skills al estudiante: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.get("/student/{student_id}/skills", response_model=List[StudentSkillResponse], tags=["Student", "Skill"])
async def get_student_skills(student_id: int, session: AsyncSession = Depends(get_session)):
    try:
        student_skill_use_case = StudentSkillUseCaseFactory(session).build()
        skill_use_case = SkillUseCaseFactory(session).build()

        skills = await student_skill_use_case.get_student_skills(student_id)
        
        # Map skill IDs to names
        response = []
        for skill in skills:
            try:
                skill_name = await skill_use_case.get_skill_name_by_id(skill.skill_id)
            except Exception:
                skill_name = "Unknown"
            
            response.append({
                "student_id": skill.student_id,
                "skill_id": skill.skill_id,
                "skill_name": skill_name
            })
            
        return response
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/student/{student_id}/skill_by_name", response_model=StudentSkillResponse, tags=["Student", "Skill"])
async def add_student_skill_by_name(student_id: int, payload: StudentSkillByNameCreate, session: AsyncSession = Depends(get_session)):
    try:
        student_skill_use_case = StudentSkillUseCaseFactory(session).build()
        skill_use_case = SkillUseCaseFactory(session).build()

        # 1. Check if skill exists globally
        all_skills = await skill_use_case.get_all_skills()
        skill_name_lower = payload.skill_name.lower().strip()
        existing_skill = next((s for s in all_skills if s.name.lower().strip() == skill_name_lower), None)
        
        skill_id = None
        if existing_skill:
            skill_id = existing_skill.id
        else:
            # 2. If not, create it
            skill_dict = {"name": payload.skill_name.strip(), "description": ""}
            skill_id = await skill_use_case.register_skill(skill_dict)
            
        # 3. Create StudentSkill association
        student_skill = StudentSkill(
            student_id=student_id,
            skill_id=skill_id
        )
        result = await student_skill_use_case.add_student_skill(student_skill)
        
        return StudentSkillResponse(
            student_id=result.student_id, 
            skill_id=result.skill_id,
            skill_name=payload.skill_name.strip()
        )
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error al agregar skill por nombre al estudiante: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
    
@router.delete("/student/{student_id}/skill/{skill_id}", response_model=dict, tags=["Student", "Skill"])
async def delete_student_skill(student_id: int, skill_id: int, session: AsyncSession = Depends(get_session)):
    try:
        student_skill_use_case = StudentSkillUseCaseFactory(session).build()
        deleted = await student_skill_use_case.delete_student_skill(student_id, skill_id)

        return deleted
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")