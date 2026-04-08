from pydantic import BaseModel, Field, field_validator
from typing import Optional
from app.adapters.input.fastapi.validators import not_empty, positive_int

class ExperienceDetailCreate(BaseModel):
    student_id: Optional[int] = Field(None, description="Student ID")
    job_offer_id: Optional[int] = Field(None, description="Job Offer ID")
    name: str = Field(..., description="Name of the experience")
    description: str = Field(..., description="Description of the experience")
    duration_in_months: int = Field(..., description="Duration in months of the experience")

    @field_validator('name', 'description')
    def not_empty_fields(cls, v, info):
        return not_empty(v, info.field_name)

    @field_validator('duration_in_months', 'student_id', 'job_offer_id')
    def positive_fields(cls, v, info):
        if v is None:
            return v
        return positive_int(v, info.field_name)

class ExperienceDetailResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    job_offer_id: Optional[int] = None
    name: str
    description: str
    duration_in_months: int