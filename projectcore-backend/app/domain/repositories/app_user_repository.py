from abc import ABC, abstractmethod
from app.domain.entities.app_user import AppUser

class AppUserRepository(ABC):
    @abstractmethod
    async def find_by_email(self, email: str) -> AppUser | None:
        pass
    
    @abstractmethod
    async def save(self, user: AppUser) -> AppUser:
        pass

    @abstractmethod
    async def get_by_id(self, user_id: int) -> AppUser | None:
        pass

    @abstractmethod
    async def update(self, user_id: int, updates: dict) -> AppUser | None:
        pass

    @abstractmethod
    async def delete(self, user_id: int) -> bool:
        pass
