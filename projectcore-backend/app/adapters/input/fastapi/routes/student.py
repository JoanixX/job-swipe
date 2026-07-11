from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.student_schema import (StudentCreate, StudentResponse, )
from app.application.factories.student_factory import StudentUseCaseFactory
from app.infraestructure.database.connection import get_session

router = APIRouter()


def serialize_student(student) -> dict[str, Any]:
    return StudentResponse.model_validate(student, from_attributes=True, ).model_dump()


@router.post("/register/student", response_model=dict, tags=["Student"], )
async def register_student(student: StudentCreate, session: AsyncSession = Depends(get_session), ):
    try:
        student_use_case = StudentUseCaseFactory(session).build()

        return await student_use_case.register_student(student.model_dump())

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), )


@router.get("/student/all", response_model=list[dict], tags=["Student"], )
async def get_all_students(session: AsyncSession = Depends(get_session), ):
    try:
        student_use_case = StudentUseCaseFactory(session).build()
        students = await student_use_case.get_all_students()

        return [serialize_student(student) for student in students]

    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", )


@router.get("/student/{student_id}", response_model=dict, tags=["Student"], )
async def get_student_by_id(student_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        student_use_case = StudentUseCaseFactory(session).build()
        student = await student_use_case.get_student(student_id)

        return serialize_student(student)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )


@router.put("/student/{student_id}", response_model=dict, tags=["Student"], )
async def update_student(student_id: int, student: StudentCreate, session: AsyncSession = Depends(get_session), ):
    try:
        student_use_case = StudentUseCaseFactory(session).build()

        updated_student = await student_use_case.update_student(student_id, student.model_dump(), )

        return serialize_student(updated_student)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )


@router.delete("/student/{student_id}", response_model=dict, tags=["Student"], )
async def delete_student(student_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        student_use_case = StudentUseCaseFactory(session).build()

        return await student_use_case.delete_student(student_id)

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error), )
