from typing import Optional

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.interest_model import InterestModel
from app.domain.entities.interest import Interest
from app.domain.repositories.interest_repository import InterestRepository


class InterestRepositoryImpl(InterestRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: InterestModel) -> Interest:
        return Interest(
            id=model.id,
            name=model.name,
        )

    async def save(self, interest: Interest) -> Interest:
        model = InterestModel(name=interest.name)
        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(self, interest_id: int) -> Optional[Interest]:
        result = await self.session.execute(
            select(InterestModel).where(
                InterestModel.id == interest_id
            )
        )

        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_all(self) -> list[Interest]:
        result = await self.session.execute(
            select(InterestModel).order_by(InterestModel.name)
        )

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def delete(self, interest_id: int) -> bool:
        result = await self.session.execute(
            delete(InterestModel).where(
                InterestModel.id == interest_id
            )
        )

        if result.rowcount == 0:
            return False

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True

    async def get_name_by_id(
            self,
            interest_id: int,
    ) -> Optional[str]:
        result = await self.session.execute(
            select(InterestModel.name).where(
                InterestModel.id == interest_id
            )
        )

        return result.scalar_one_or_none()
