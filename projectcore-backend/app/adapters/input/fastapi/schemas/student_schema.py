from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.adapters.input.fastapi.validators import (
    in_choices,
    in_range,
    not_empty,
)


class StudentCreate(BaseModel):
    weekly_availability: int = Field(..., description="Weekly availability")
    preferred_modality: int = Field(..., description="Preferred modality")
    career: str = Field(..., description="Career")
    academic_cycle: int = Field(..., description="Academic cycle")
    university: Optional[str] = Field(None, description="University name")
    embedding: Optional[dict[str, Any]] = None

    @field_validator("career")
    @classmethod
    def validate_career(cls, value: str, info):
        return not_empty(value, info.field_name)

    @field_validator("weekly_availability")
    @classmethod
    def validate_weekly_availability(cls, value: int):
        return in_range(value, 1, 40, "La disponibilidad semanal")

    @field_validator("academic_cycle")
    @classmethod
    def validate_academic_cycle(cls, value: int):
        return in_range(value, 1, 12, "El ciclo académico")

    @field_validator("preferred_modality")
    @classmethod
    def validate_preferred_modality(cls, value: int):
        return in_choices(value, [1, 2, 3], "La modalidad preferida")


class StudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    weekly_availability: int
    preferred_modality: int
    career: str
    academic_cycle: int
    university: Optional[str] = None
    embedding: Optional[dict[str, Any]] = None
