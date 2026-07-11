from datetime import datetime
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.repositories.company_repository_impl import (CompanyRepositoryImpl, )
from app.application.ports.company_port import CompanyPort
from app.domain.entities.company import Company


class CompanyPortImpl(CompanyPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.company_repo = CompanyRepositoryImpl(session)

    async def register_company(self, company_data: dict[str, Any], ) -> Company:
        now = datetime.utcnow()

        company = Company(id=0, name=company_data["name"], industry=company_data["industry"],
                          company_culture=company_data["company_culture"],
                          contact_email=company_data.get("contact_email"),
                          phone=company_data.get("phone"), website=company_data.get("website"),
                          location=company_data.get("location"),
                          created_at=company_data.get("created_at", now),
                          updated_at=company_data.get("updated_at", now),
                          deleted_at=company_data.get("deleted_at"), )

        return await self.company_repo.save(company)

    async def get_all_companies(self) -> list[Company]:
        return await self.company_repo.get_all()

    async def get_company(self, company_id: int, ) -> Optional[Company]:
        return await self.company_repo.find_by_id(company_id)

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

    async def validate_company_data(self, company_data: dict[str, Any], partial: bool = False, ) -> bool:
        required_fields = ("name", "industry", "company_culture",)

        if not partial:
            for field in required_fields:
                value = company_data.get(field)

                if not isinstance(value, str) or not value.strip():
                    return False

        for field in required_fields:
            if field in company_data:
                value = company_data[field]

                if not isinstance(value, str) or not value.strip():
                    return False

        return True
