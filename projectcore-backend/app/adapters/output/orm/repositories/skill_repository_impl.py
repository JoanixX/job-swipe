from typing import Optional

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.skill_model import SkillModel
from app.domain.entities.skill import Skill
from app.domain.repositories.skill_repository import SkillRepository


class SkillRepositoryImpl(SkillRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _to_entity(model: SkillModel) -> Skill:
        return Skill(
            id=model.id,
            name=model.name,
        )

    async def save(self, skill: Skill) -> Skill:
        model = SkillModel(name=skill.name)
        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return self._to_entity(model)

    async def find_by_id(self, skill_id: int) -> Optional[Skill]:
        result = await self.session.execute(
            select(SkillModel).where(SkillModel.id == skill_id)
        )

        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_all(self) -> list[Skill]:
        result = await self.session.execute(
            select(SkillModel).order_by(SkillModel.name)
        )

        return [
            self._to_entity(model)
            for model in result.scalars().all()
        ]

    async def delete(self, skill_id: int) -> bool:
        result = await self.session.execute(
            delete(SkillModel).where(SkillModel.id == skill_id)
        )

        if result.rowcount == 0:
            return False

        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return True

    async def get_name_by_id(self, skill_id: int) -> Optional[str]:
        result = await self.session.execute(
            select(SkillModel.name).where(SkillModel.id == skill_id)
        )

        return result.scalar_one_or_none()
