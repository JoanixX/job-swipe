import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.infraestructure.database.connection import get_session
from app.adapters.input.fastapi.schemas.swipe_schema import StudentSwipeRequest, CompanySwipeRequest, SwipeResponse
from app.adapters.output.orm.models.match_job_student_model import MatchJobStudentModel
from app.adapters.output.orm.models.job_offer_model import JobOfferModel
from app.adapters.output.orm.models.student_model import StudentModel

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/swipe/student", response_model=SwipeResponse, tags=["Swipe"])
async def student_swipe(req: StudentSwipeRequest, session: AsyncSession = Depends(get_session)):
    # Find existing match
    stmt = select(MatchJobStudentModel).where(
        MatchJobStudentModel.student_id == req.student_id,
        MatchJobStudentModel.job_offer_id == req.job_offer_id
    )
    result = await session.execute(stmt)
    match = result.scalars().first()

    if not match:
        from datetime import datetime
        # Fallback creation
        match = MatchJobStudentModel(
            student_id=req.student_id,
            job_offer_id=req.job_offer_id,
            score=0,
            match_date=datetime.now(),
            rank=0,
            student_liked=req.liked,
            company_liked=None
        )
        session.add(match)
    else:
        match.student_liked = req.liked

    match.student_liked = req.liked
    await session.commit()
    await session.refresh(match)

    mutual = bool(match.student_liked and match.company_liked)
    return SwipeResponse(message="Swipe recorded", mutual_match=mutual)

@router.post("/swipe/company", response_model=SwipeResponse, tags=["Swipe"])
async def company_swipe(req: CompanySwipeRequest, session: AsyncSession = Depends(get_session)):
    stmt = select(MatchJobStudentModel).where(
        MatchJobStudentModel.student_id == req.student_id,
        MatchJobStudentModel.job_offer_id == req.job_offer_id
    )
    result = await session.execute(stmt)
    match = result.scalars().first()

    if not match:
        from datetime import datetime
        match = MatchJobStudentModel(
            student_id=req.student_id,
            job_offer_id=req.job_offer_id,
            score=0,
            match_date=datetime.now(),
            rank=0,
            student_liked=None,
            company_liked=req.liked
        )
        session.add(match)
    else:
        match.company_liked = req.liked

    match.company_liked = req.liked
    await session.commit()
    await session.refresh(match)

    mutual = bool(match.student_liked and match.company_liked)
    return SwipeResponse(message="Swipe recorded", mutual_match=mutual)

@router.get("/matches/student/{student_id}", tags=["Swipe"])
async def get_student_mutual_matches(student_id: int, session: AsyncSession = Depends(get_session)):
    stmt = select(MatchJobStudentModel, JobOfferModel).join(
        JobOfferModel, MatchJobStudentModel.job_offer_id == JobOfferModel.id
    ).where(
        MatchJobStudentModel.student_id == student_id,
        MatchJobStudentModel.student_liked == True,
        MatchJobStudentModel.company_liked == True
    )
    result = await session.execute(stmt)
    rows = result.all()
    
    matches = []
    for m, j in rows:
        matches.append({
            "match_id": m.id,
            "job_offer": {
                "id": j.id,
                "title": j.title,
                "company_id": j.company_id
            },
            "match_date": m.match_date
        })
    return matches

@router.get("/matches/company/{company_id}", tags=["Swipe"])
async def get_company_mutual_matches(company_id: int, session: AsyncSession = Depends(get_session)):
    stmt = select(MatchJobStudentModel, StudentModel, JobOfferModel).join(
        StudentModel, MatchJobStudentModel.student_id == StudentModel.id
    ).join(
        JobOfferModel, MatchJobStudentModel.job_offer_id == JobOfferModel.id
    ).where(
        JobOfferModel.company_id == company_id,
        MatchJobStudentModel.student_liked == True,
        MatchJobStudentModel.company_liked == True
    )
    result = await session.execute(stmt)
    rows = result.all()

    matches = []
    for m, s, j in rows:
        matches.append({
            "match_id": m.id,
            "job_offer_id": j.id,
            "job_title": j.title,
            "student": {
                "id": s.id,
                "user_id": s.user_id,
                "university": s.university_id  # fallback
            },
            "match_date": m.match_date
        })
    return matches
