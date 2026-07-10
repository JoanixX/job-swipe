from pydantic import BaseModel, Field, field_validator
from typing import Optional
from app.adapters.input.fastapi.validators import not_empty

class CompanyCreate(BaseModel):
    name: str = Field(..., description="Nombre de la empresa")
    industry: str = Field(..., description="Industria de la empresa")
    company_culture: str = Field(..., description="Cultura de la empresa")
    contact_email: Optional[str] = Field(None, description="Email de contacto de la empresa")
    phone: Optional[str] = Field(None, description="Teléfono de la empresa")
    website: Optional[str] = Field(None, description="Sitio web de la empresa")
    location: Optional[str] = Field(None, description="Dirección de la empresa")

    @field_validator('name', 'industry', 'company_culture')
    def not_empty_fields(cls, v, info):
        return not_empty(v, info.field_name)
    
class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: str
    company_culture: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None