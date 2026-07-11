from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.student_interest import StudentInterest


class StudentInterestRepository(ABC):
    @abstractmethod
    async def get_by_student_id(self, student_id: int, ) -> List[StudentInterest]:
        raise NotImplementedError

    @abstractmethod
    async def exists(self, student_id: int, interest_id: int, ) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def save(self, student_interest: StudentInterest, ) -> StudentInterest:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, student_id: int, interest_id: int, ) -> bool:
        raise NotImplementedError
