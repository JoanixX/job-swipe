from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentSwipeRequest(BaseModel):
    student_id: int
    job_offer_id: int
    liked: bool

class CompanySwipeRequest(BaseModel):
    company_id: int
    student_id: int
    job_offer_id: int
    liked: bool

class SwipeResponse(BaseModel):
    message: str
    mutual_match: bool
