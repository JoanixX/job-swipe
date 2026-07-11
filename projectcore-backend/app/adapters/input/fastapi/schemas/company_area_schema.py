from pydantic import BaseModel, Field


class CompanyAreaCreate(BaseModel):
    company_id: int = Field(..., gt=0, description="ID de la compañía", )

    area_id: int = Field(..., gt=0, description="ID del área", )


class CompanyAreaResponse(BaseModel):
    company_id: int
    area_id: int
