from pydantic import BaseModel, Field


class JobOfferAreaCreate(BaseModel):
    job_offer_id: int = Field(
        ...,
        gt=0,
        description="ID de la oferta de trabajo",
    )

    area_id: int = Field(
        ...,
        gt=0,
        description="ID del área",
    )


class JobOfferAreaResponse(BaseModel):
    job_offer_id: int
    area_id: int