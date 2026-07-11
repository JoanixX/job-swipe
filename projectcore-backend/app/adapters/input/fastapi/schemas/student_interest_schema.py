from pydantic import BaseModel, Field, field_validator


class StudentInterestCreate(BaseModel):
    student_id: int = Field(..., description="ID del estudiante")
    interest_id: int = Field(..., description="ID del interés")

    @field_validator("student_id", "interest_id")
    @classmethod
    def validate_ids(cls, value: int):
        if value <= 0:
            raise ValueError("Los IDs deben ser mayores que cero")
        return value


class StudentInterestResponse(BaseModel):
    student_id: int
    interest_id: int
    interest_name: str | None = None
