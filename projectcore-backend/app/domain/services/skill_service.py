from typing import Any, Optional

from app.domain.entities.skill import Skill
from app.domain.repositories.skill_repository import SkillRepository


class SkillService:
    def __init__(self, skill_repo: SkillRepository):
        self.skill_repo = skill_repo

    async def register_skill(self, skill_data: dict[str, Any]) -> int:
        name = skill_data.get("name")

        if not isinstance(name, str) or not name.strip():
            raise ValueError("El nombre de la habilidad es obligatorio")

        skill = Skill(
            id=0,
            name=name.strip(),
        )

        existing_skills = await self.skill_repo.get_all()

        if any(
                existing.name.strip().lower() == skill.name.lower()
                for existing in existing_skills
        ):
            raise ValueError("La habilidad ya existe")

        saved_skill = await self.skill_repo.save(skill)

        if saved_skill is None:
            raise ValueError("Error al guardar la habilidad")

        return saved_skill.id

    async def get_skill(self, skill_id: int) -> Optional[Skill]:
        if skill_id <= 0:
            raise ValueError("El ID de la habilidad debe ser mayor que cero")

        return await self.skill_repo.find_by_id(skill_id)

    async def get_all_skills(self) -> list[Skill]:
        return await self.skill_repo.get_all()

    async def delete_skill(self, skill_id: int) -> bool:
        if skill_id <= 0:
            raise ValueError("El ID de la habilidad debe ser mayor que cero")

        return await self.skill_repo.delete(skill_id)

    async def get_name_by_id(self, skill_id: int) -> Optional[str]:
        skill = await self.get_skill(skill_id)
        return skill.name if skill else None
