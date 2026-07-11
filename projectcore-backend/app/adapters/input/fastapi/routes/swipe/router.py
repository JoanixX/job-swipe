from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.input.fastapi.schemas.swipe_schema import (CompanySwipeRequest, StudentSwipeRequest, SwipeResponse, )
from app.adapters.output.orm.models.company_model import CompanyModel
from app.adapters.output.orm.models.job_offer_model import JobOfferModel
from app.adapters.output.orm.models.match_job_student_model import (MatchJobStudentModel, )
from app.adapters.output.orm.models.student_model import StudentModel
from app.infraestructure.database.connection import get_session

router = APIRouter()


async def get_active_student(session: AsyncSession, student_id: int, ) -> StudentModel | None:
    result = await session.execute(
        select(StudentModel).where(StudentModel.id == student_id, StudentModel.deleted_at.is_(None), ))

    return result.scalar_one_or_none()


async def get_active_job_offer(session: AsyncSession, job_offer_id: int, ) -> JobOfferModel | None:
    result = await session.execute(
        select(JobOfferModel).where(JobOfferModel.id == job_offer_id, JobOfferModel.deleted_at.is_(None), ))

    return result.scalar_one_or_none()


async def get_active_company(session: AsyncSession, company_id: int, ) -> CompanyModel | None:
    result = await session.execute(
        select(CompanyModel).where(CompanyModel.id == company_id, CompanyModel.deleted_at.is_(None), ))

    return result.scalar_one_or_none()


async def get_match(session: AsyncSession, student_id: int, job_offer_id: int, ) -> MatchJobStudentModel | None:
    result = await session.execute(select(MatchJobStudentModel).where(MatchJobStudentModel.student_id == student_id,
                                                                      MatchJobStudentModel.job_offer_id == job_offer_id,
                                                                      MatchJobStudentModel.deleted_at.is_(None), ))

    return result.scalar_one_or_none()


@router.post("/swipe/student", response_model=SwipeResponse, tags=["Swipe"], )
async def student_swipe(request: StudentSwipeRequest, session: AsyncSession = Depends(get_session), ):
    student = await get_active_student(session, request.student_id, )

    if student is None:
        raise HTTPException(status_code=404, detail="El estudiante no existe o está eliminado", )

    job_offer = await get_active_job_offer(session, request.job_offer_id, )

    if job_offer is None:
        raise HTTPException(status_code=404, detail="La oferta no existe o está eliminada", )

    match = await get_match(session, request.student_id, request.job_offer_id, )

    if match is None:
        raise HTTPException(status_code=404, detail=("No existe un match activo entre el estudiante "
                                                     "y la oferta"), )

    match.student_liked = request.liked
    match.updated_at = datetime.utcnow()

    try:
        await session.commit()
        await session.refresh(match)
    except Exception:
        await session.rollback()
        raise

    mutual_match = bool(match.student_liked and match.company_liked)

    return SwipeResponse(message="Swipe del estudiante registrado correctamente", mutual_match=mutual_match, )


@router.post("/swipe/company", response_model=SwipeResponse, tags=["Swipe"], )
async def company_swipe(request: CompanySwipeRequest, session: AsyncSession = Depends(get_session), ):
    company = await get_active_company(session, request.company_id, )

    if company is None:
        raise HTTPException(status_code=404, detail="La compañía no existe o está eliminada", )

    student = await get_active_student(session, request.student_id, )

    if student is None:
        raise HTTPException(status_code=404, detail="El estudiante no existe o está eliminado", )

    job_offer = await get_active_job_offer(session, request.job_offer_id, )

    if job_offer is None:
        raise HTTPException(status_code=404, detail="La oferta no existe o está eliminada", )

    if job_offer.company_id != request.company_id:
        raise HTTPException(status_code=403, detail=("La compañía no es propietaria de la oferta "
                                                     "de trabajo"), )

    match = await get_match(session, request.student_id, request.job_offer_id, )

    if match is None:
        raise HTTPException(status_code=404, detail=("No existe un match activo entre el estudiante "
                                                     "y la oferta"), )

    match.company_liked = request.liked
    match.updated_at = datetime.utcnow()

    try:
        await session.commit()
        await session.refresh(match)
    except Exception:
        await session.rollback()
        raise

    mutual_match = bool(match.student_liked and match.company_liked)

    return SwipeResponse(message="Swipe de la compañía registrado correctamente", mutual_match=mutual_match, )


@router.get("/matches/student/{student_id}", response_model=list[dict], tags=["Swipe"], )
async def get_student_mutual_matches(student_id: int, session: AsyncSession = Depends(get_session), ):
    student = await get_active_student(session, student_id)

    if student is None:
        raise HTTPException(status_code=404, detail="El estudiante no existe o está eliminado", )

    statement = (select(MatchJobStudentModel, JobOfferModel).join(JobOfferModel,
                                                                  MatchJobStudentModel.job_offer_id == JobOfferModel.id, ).where(
        MatchJobStudentModel.student_id == student_id,
        MatchJobStudentModel.student_liked.is_(True), MatchJobStudentModel.company_liked.is_(True),
        MatchJobStudentModel.deleted_at.is_(None), JobOfferModel.deleted_at.is_(None), ).order_by(
        MatchJobStudentModel.match_date.desc()))

    result = await session.execute(statement)
    rows = result.all()

    return [
        {"match_id": match.id, "job_offer": {"id": offer.id, "title": offer.title, "company_id": offer.company_id, },
         "match_date": match.match_date, } for match, offer in rows]


@router.get("/matches/company/{company_id}", response_model=list[dict], tags=["Swipe"], )
async def get_company_mutual_matches(company_id: int, session: AsyncSession = Depends(get_session), ):
    company = await get_active_company(session, company_id)

    if company is None:
        raise HTTPException(status_code=404, detail="La compañía no existe o está eliminada", )

    statement = (select(MatchJobStudentModel, StudentModel, JobOfferModel, ).join(StudentModel,
                                                                                  MatchJobStudentModel.student_id == StudentModel.id, ).join(
        JobOfferModel,
        MatchJobStudentModel.job_offer_id == JobOfferModel.id, ).where(JobOfferModel.company_id == company_id,
                                                                       MatchJobStudentModel.student_liked.is_(True),
                                                                       MatchJobStudentModel.company_liked.is_(True),
                                                                       MatchJobStudentModel.deleted_at.is_(None),
                                                                       StudentModel.deleted_at.is_(None),
                                                                       JobOfferModel.deleted_at.is_(None), ).order_by(
        MatchJobStudentModel.match_date.desc()))

    result = await session.execute(statement)
    rows = result.all()

    return [{"match_id": match.id, "job_offer_id": offer.id, "job_title": offer.title,
             "student": {"id": student.id, "university": student.university, }, "match_date": match.match_date, } for
            match, student, offer in rows]
