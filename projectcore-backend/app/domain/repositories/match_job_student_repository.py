from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.match_job_student import MatchJobStudent


class MatchJobStudentRepository(ABC):
    @abstractmethod
    async def save(
            self,
            match_job_student: MatchJobStudent,
    ) -> MatchJobStudent:
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(
            self,
            match_id: int,
    ) -> Optional[MatchJobStudent]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_student_id(
            self,
            student_id: int,
    ) -> List[MatchJobStudent]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_job_offer_id(
            self,
            job_offer_id: int,
    ) -> List[MatchJobStudent]:
        raise NotImplementedError

    @abstractmethod
    async def find_by_student_and_offer(
            self,
            student_id: int,
            job_offer_id: int,
    ) -> Optional[MatchJobStudent]:
        raise NotImplementedError

    @abstractmethod
    async def update(
            self,
            match_job_student: MatchJobStudent,
    ) -> Optional[MatchJobStudent]:
        raise NotImplementedError
