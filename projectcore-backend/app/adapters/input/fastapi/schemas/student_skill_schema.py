from pydantic import BaseModel, Field, field_validator


class StudentSkillCreate(BaseModel):
    student_id: int = Field(..., description="ID del estudiante")
    skill_id: int = Field(..., description="ID de la habilidad")

    @field_validator("student_id", "skill_id")
    @classmethod
    def validate_ids(cls, value: int):
        if value <= 0:
            raise ValueError("Los IDs deben ser mayores que cero")
        return value


class StudentSkillResponse(BaseModel):
    student_id: int
    skill_id: int
    skill_name: str | None = None


class StudentSkillByNameCreate(BaseModel):
    skill_name: str = Field(..., min_length=1)

    @field_validator("skill_name")
    @classmethod
    def validate_skill_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("El nombre de la habilidad no puede estar vacío")

        return value
