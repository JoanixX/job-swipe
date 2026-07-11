from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class MatchJobStudentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    student_id: int = Field(..., gt=0)
    job_offer_id: int = Field(..., gt=0)
    score: float = Field(..., ge=0, le=1)
    match_date: Optional[datetime] = None
    rank: int = Field(..., gt=0)


class MatchJobStudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    student_id: int
    job_offer_id: int
    score: float
    match_date: datetime
    rank: int
    student_liked: Optional[bool] = None
    company_liked: Optional[bool] = None

    title: Optional[str] = None
    company_name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    modality: Optional[int] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    approximated_salary: Optional[int] = None
    match_score: Optional[float] = None
    skills: Optional[list[dict[str, Any]]] = None
