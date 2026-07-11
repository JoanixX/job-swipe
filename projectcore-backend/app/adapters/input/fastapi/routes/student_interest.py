from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.student_interest_schema import (StudentInterestCreate,
                                                                        StudentInterestResponse, )
from app.application.factories.student_interest_factory import (StudentInterestUseCaseFactory, )
from app.infraestructure.database.connection import get_session

router = APIRouter()


@router.post("/student/student_interest", response_model=StudentInterestResponse, tags=["Student", "Interest"], )
async def add_student_interest(payload: StudentInterestCreate, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = StudentInterestUseCaseFactory(session).build()

        from app.domain.entities.student_interest import StudentInterest

        result = await use_case.add_student_interest(
            StudentInterest(student_id=payload.student_id, interest_id=payload.interest_id, ))

        return StudentInterestResponse(student_id=result.student_id, interest_id=result.interest_id, )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/student/{student_id}/interests", response_model=list[StudentInterestResponse],
            tags=["Student", "Interest"], )
async def get_student_interests(student_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = StudentInterestUseCaseFactory(session).build()
        interests = await use_case.get_student_interests(student_id)

        return [StudentInterestResponse(student_id=interest.student_id, interest_id=interest.interest_id, ) for interest
                in interests]

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.delete("/student/{student_id}/interest/{interest_id}", response_model=dict, tags=["Student", "Interest"], )
async def delete_student_interest(student_id: int, interest_id: int, session: AsyncSession = Depends(get_session), ):
    try:
        use_case = StudentInterestUseCaseFactory(session).build()
        return await use_case.delete_student_interest(student_id, interest_id, )

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
