from pydantic import BaseModel, Field


class StudentSwipeRequest(BaseModel):
    student_id: int = Field(..., gt=0)
    job_offer_id: int = Field(..., gt=0)
    liked: bool


class CompanySwipeRequest(BaseModel):
    company_id: int = Field(..., gt=0)
    student_id: int = Field(..., gt=0)
    job_offer_id: int = Field(..., gt=0)
    liked: bool


class SwipeResponse(BaseModel):
    message: str
    mutual_match: bool