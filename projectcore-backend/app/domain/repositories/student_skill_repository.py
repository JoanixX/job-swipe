from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.student_skill import StudentSkill


class StudentSkillRepository(ABC):
    @abstractmethod
    async def get_by_student_id(self, student_id: int, ) -> List[StudentSkill]:
        raise NotImplementedError

    @abstractmethod
    async def exists(self, student_id: int, skill_id: int, ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def save(self, student_skill: StudentSkill, ) -> StudentSkill:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, student_id: int, skill_id: int, ) -> bool:
        raise NotImplementedError
