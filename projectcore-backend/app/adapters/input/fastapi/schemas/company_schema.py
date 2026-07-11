from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def validate_required_text(value: str, field_name: str) -> str:
    value = value.strip()

    if not value:
        raise ValueError(f"{field_name} no puede estar vacío")

    return value


def validate_optional_text(
        value: Optional[str],
) -> Optional[str]:
    if value is None:
        return None

    value = value.strip()

    return value or None


class CompanyCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(..., min_length=1, max_length=50)
    company_culture: str = Field(..., min_length=1, max_length=100)
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return validate_required_text(value, "El nombre")

    @field_validator("industry")
    @classmethod
    def validate_industry(cls, value: str) -> str:
        return validate_required_text(value, "La industria")

    @field_validator("company_culture")
    @classmethod
    def validate_company_culture(cls, value: str) -> str:
        return validate_required_text(value, "La cultura empresarial")

    @field_validator("phone", "website", "location")
    @classmethod
    def validate_optional_fields(
            cls,
            value: Optional[str],
    ) -> Optional[str]:
        return validate_optional_text(value)


class CompanyUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    industry: Optional[str] = Field(None, min_length=1, max_length=50)
    company_culture: Optional[str] = Field(None, min_length=1, max_length=100)
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value)

    @field_validator("industry")
    @classmethod
    def validate_industry(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value)

    @field_validator("company_culture")
    @classmethod
    def validate_company_culture(
            cls,
            value: Optional[str],
    ) -> Optional[str]:
        return validate_optional_text(value)

    @field_validator("phone", "website", "location")
    @classmethod
    def validate_optional_fields(
            cls,
            value: Optional[str],
    ) -> Optional[str]:
        return validate_optional_text(value)


class CompanyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    industry: str
    company_culture: str
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None