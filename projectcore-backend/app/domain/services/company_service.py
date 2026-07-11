from datetime import datetime
from typing import Any, Optional

from app.domain.entities.company import Company
from app.domain.repositories.company_repository import CompanyRepository


class CompanyService:
    def __init__(self, company_repo: CompanyRepository):
        self.company_repo = company_repo

    async def register_company(self, company_data: dict[str, Any], ) -> int:
        company = self.company_entity(company_data)
        saved_company = await self.company_repo.save(company)

        if saved_company is None:
            raise ValueError("Error al guardar la empresa")

        return saved_company.id

    async def get_company(self, company_id: int, ) -> Optional[Company]:
        return await self.company_repo.find_by_id(company_id)

    async def get_all_companies(self) -> list[Company]:
        return await self.company_repo.get_all()

    async def update_company(self, company_id: int, company_data: dict[str, Any], ) -> Optional[Company]:
        existing_company = await self.company_repo.find_by_id(company_id)

        if existing_company is None:
            return None

        updated_company = Company(id=company_id, name=company_data.get("name", existing_company.name, ),
                                  industry=company_data.get("industry", existing_company.industry, ),
                                  company_culture=company_data.get("company_culture",
                                                                   existing_company.company_culture, ),
                                  contact_email=company_data.get("contact_email", existing_company.contact_email, ),
                                  phone=company_data.get("phone", existing_company.phone, ),
                                  website=company_data.get("website", existing_company.website, ),
                                  location=company_data.get("location", existing_company.location, ),
                                  created_at=existing_company.created_at,
                                  updated_at=datetime.utcnow(), deleted_at=existing_company.deleted_at, )

        return await self.company_repo.update(updated_company)

    async def delete_company(self, company_id: int) -> bool:
        return await self.company_repo.delete(company_id)

    @staticmethod
    def company_entity(company_data: dict[str, Any], ) -> Company:
        now = datetime.utcnow()

        return Company(id=0, name=company_data["name"], industry=company_data["industry"],
                       company_culture=company_data["company_culture"], contact_email=company_data.get("contact_email"),
                       phone=company_data.get("phone"), website=company_data.get("website"),
                       location=company_data.get("location"),
                       created_at=company_data.get("created_at", now), updated_at=company_data.get("updated_at", now),
                       deleted_at=company_data.get("deleted_at"), )
