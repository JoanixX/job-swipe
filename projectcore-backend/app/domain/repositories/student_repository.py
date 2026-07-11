from abc import ABC, abstractmethod
from typing import Any, Optional

from app.domain.entities.student import Student


class StudentRepository(ABC):
    @abstractmethod
    async def get_enriched_students(self) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    async def save(self, student: Student) -> Student:
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(self, student_id: int) -> Optional[Student]:
        raise NotImplementedError

    @abstractmethod
    async def get_all(self) -> list[Student]:
        raise NotImplementedError

    @abstractmethod
    async def update(self, student: Student) -> Optional[Student]:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, student_id: int) -> bool:
        raise NotImplementedError
