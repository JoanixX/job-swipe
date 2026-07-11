from typing import Any, Optional

from app.domain.entities.interest import Interest
from app.domain.repositories.interest_repository import InterestRepository


class InterestService:
    def __init__(self, interest_repo: InterestRepository):
        self.interest_repo = interest_repo

    async def register_interest(
            self,
            interest_data: dict[str, Any],
    ) -> int:
        name = interest_data.get("name")

        if not isinstance(name, str) or not name.strip():
            raise ValueError("El nombre del interés es obligatorio")

        interest = Interest(
            id=0,
            name=name.strip(),
        )

        existing_interests = await self.interest_repo.get_all()

        if any(
                existing.name.strip().lower() == interest.name.lower()
                for existing in existing_interests
        ):
            raise ValueError("El interés ya existe")

        saved_interest = await self.interest_repo.save(interest)

        if saved_interest is None:
            raise ValueError("Error al guardar el interés")

        return saved_interest.id

    async def get_interest(
            self,
            interest_id: int,
    ) -> Optional[Interest]:
        if interest_id <= 0:
            raise ValueError("El ID del interés debe ser mayor que cero")

        return await self.interest_repo.find_by_id(interest_id)

    async def get_all_interests(self) -> list[Interest]:
        return await self.interest_repo.get_all()

    async def delete_interest(self, interest_id: int) -> bool:
        if interest_id <= 0:
            raise ValueError("El ID del interés debe ser mayor que cero")

        return await self.interest_repo.delete(interest_id)

    async def get_name_by_id(
            self,
            interest_id: int,
    ) -> Optional[str]:
        interest = await self.get_interest(interest_id)
        return interest.name if interest else None
