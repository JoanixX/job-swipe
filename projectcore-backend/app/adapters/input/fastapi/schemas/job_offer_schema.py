from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.adapters.input.fastapi.validators import start_date_future


def required_text(value: str, field_name: str) -> str:
    value = value.strip()

    if not value:
        raise ValueError(f"{field_name} no puede estar vacío")

    return value


def optional_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None

    value = value.strip()
    return value or None


class JobOfferCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    company_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=60)
    description: str = Field(..., min_length=1, max_length=200)
    required_hours: int = Field(..., gt=0, le=168)
    approximated_salary: int = Field(..., ge=0)
    duration: int = Field(..., gt=0)
    start_date: date
    modality: int = Field(..., ge=1, le=3)
    location: Optional[str] = Field(None, max_length=255)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        return required_text(value, "El título")

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        return required_text(value, "La descripción")

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, value: date) -> date:
        return start_date_future(value, "La fecha de inicio", )

    @field_validator("location")
    @classmethod
    def validate_location(cls, value: Optional[str], ) -> Optional[str]:
        return optional_text(value)


class JobOfferUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    company_id: Optional[int] = Field(None, gt=0)
    title: Optional[str] = Field(None, min_length=1, max_length=60)
    description: Optional[str] = Field(None, min_length=1, max_length=200)
    required_hours: Optional[int] = Field(None, gt=0, le=168)
    approximated_salary: Optional[int] = Field(None, ge=0)
    duration: Optional[int] = Field(None, gt=0)
    start_date: Optional[date] = None
    modality: Optional[int] = Field(None, ge=1, le=3)
    location: Optional[str] = Field(None, max_length=255)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: Optional[str]) -> Optional[str]:
        return optional_text(value)

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: Optional[str], ) -> Optional[str]:
        return optional_text(value)

    @field_validator("location")
    @classmethod
    def validate_location(cls, value: Optional[str], ) -> Optional[str]:
        return optional_text(value)

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, value: Optional[date], ) -> Optional[date]:
        if value is None:
            return None

        return start_date_future(value, "La fecha de inicio", )


class JobOfferResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    title: str
    description: str
    required_hours: int
    approximated_salary: int
    duration: int
    start_date: date
    modality: int
    location: Optional[str] = None
    embedding: Optional[dict[str, Any]] = None
