from datetime import date
from typing import Optional

from pydantic import (BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator, )

from app.domain.entities.app_user import UserRole


def validate_text(value: str, field_name: str) -> str:
    if value is None:
        raise ValueError(f"{field_name} es obligatorio")

    value = value.strip()

    if not value:
        raise ValueError(f"{field_name} no puede estar vacío")

    return value


def validate_optional_text(value: Optional[str], field_name: str) -> Optional[str]:
    if value is None:
        return None

    value = value.strip()

    if not value:
        return None

    return value


class AppUserCreate(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    email: EmailStr = Field(..., description="Correo electrónico del usuario", )

    password: str = Field(..., min_length=8, max_length=128, description="Contraseña del usuario", )

    dni: str = Field(..., min_length=8, max_length=8, description="DNI del usuario", )

    name: str = Field(..., min_length=1, max_length=50, description="Nombre del usuario", )

    location: str = Field(..., min_length=1, max_length=100, description="Ubicación del usuario", )

    role: UserRole = Field(..., description="Rol del usuario", )

    related_id: int = Field(..., gt=0, description="ID relacionado con el estudiante o la compañía", )

    cv_url: Optional[str] = Field(None, max_length=512, description="URL del CV del estudiante", )

    date_of_birth: Optional[date] = Field(None, description="Fecha de nacimiento del estudiante", )

    main_motivation: Optional[str] = Field(None, max_length=200, description="Motivación principal del estudiante", )

    description: Optional[str] = Field(None, max_length=350, description="Descripción del usuario", )

    ruc: Optional[str] = Field(None, max_length=50, description="RUC de la compañía", )

    phone: Optional[str] = Field(None, max_length=20, description="Teléfono del usuario", )

    linkedin: Optional[str] = Field(None, max_length=200, description="Perfil de LinkedIn", )

    portfolio: Optional[str] = Field(None, max_length=200, description="Portafolio del usuario", )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("La contraseña no puede estar vacía")

        if len(value) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")

        return value

    @field_validator("dni")
    @classmethod
    def validate_dni(cls, value: str) -> str:
        value = value.strip()

        if not value.isdigit():
            raise ValueError("El DNI debe contener únicamente números")

        if len(value) != 8:
            raise ValueError("El DNI debe tener exactamente 8 dígitos")

        return value

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return validate_text(value, "El nombre")

    @field_validator("location")
    @classmethod
    def validate_location(cls, value: str) -> str:
        return validate_text(value, "La ubicación")

    @field_validator("cv_url")
    @classmethod
    def validate_cv_url(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value, "El CV")

    @field_validator("main_motivation")
    @classmethod
    def validate_main_motivation(cls, value: Optional[str], ) -> Optional[str]:
        return validate_optional_text(value, "La motivación principal")

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: Optional[str], ) -> Optional[str]:
        return validate_optional_text(value, "La descripción")

    @field_validator("ruc")
    @classmethod
    def validate_ruc(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value, "El RUC")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value, "El teléfono")

    @field_validator("linkedin")
    @classmethod
    def validate_linkedin(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value, "LinkedIn")

    @field_validator("portfolio")
    @classmethod
    def validate_portfolio(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_text(value, "El portafolio")

    @model_validator(mode="after")
    def validate_role_fields(self):
        role = self.role.value if hasattr(self.role, "value") else self.role

        if role == UserRole.student.value:
            missing_fields = []

            if self.date_of_birth is None:
                missing_fields.append("date_of_birth")

            if not self.main_motivation:
                missing_fields.append("main_motivation")

            if not self.description:
                missing_fields.append("description")

            if missing_fields:
                raise ValueError("Campos requeridos para estudiante: " + ", ".join(missing_fields))

        if role == UserRole.company.value:
            if not self.ruc:
                raise ValueError("El campo ruc es obligatorio para compañías")

        return self


class AppUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True, )

    id: int
    email: EmailStr
    dni: str
    name: Optional[str] = None
    location: Optional[str] = None
    role: UserRole
    related_id: int
    cv_url: Optional[str] = None
    date_of_birth: Optional[date] = None
    main_motivation: Optional[str] = None
    description: Optional[str] = None
    ruc: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class LoginCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128, )


class UpdatePasswordCreate(BaseModel):
    current_password: str = Field(..., min_length=1, max_length=128, )

    new_password: str = Field(..., min_length=8, max_length=128, )

    @field_validator("current_password")
    @classmethod
    def validate_current_password(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("La contraseña actual no puede estar vacía")

        return value

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("La nueva contraseña no puede estar vacía")

        if len(value) < 8:
            raise ValueError("La nueva contraseña debe tener al menos 8 caracteres")

        return value


class AppUserUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(None, min_length=1, max_length=50, )

    location: Optional[str] = Field(None, min_length=1, max_length=100, )

    phone: Optional[str] = Field(None, max_length=20, )

    linkedin: Optional[str] = Field(None, max_length=200, )

    portfolio: Optional[str] = Field(None, max_length=200, )

    cv_url: Optional[str] = Field(None, max_length=512, )

    date_of_birth: Optional[date] = None

    main_motivation: Optional[str] = Field(None, max_length=200, )

    description: Optional[str] = Field(None, max_length=350, )

    @field_validator("name", "location", "phone", "linkedin", "portfolio", "cv_url", "main_motivation", "description", )
    @classmethod
    def normalize_optional_text(cls, value: Optional[str], ) -> Optional[str]:
        return validate_optional_text(value, "El campo")
