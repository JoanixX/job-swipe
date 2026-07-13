from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.models.password_reset_token_model import PasswordResetTokenModel


class PasswordResetTokenRepositoryImpl:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, user_id: int, token_hash: str, expires_at: datetime, ) -> PasswordResetTokenModel:
        model = PasswordResetTokenModel(user_id=user_id, token_hash=token_hash, expires_at=expires_at, )

        self.session.add(model)

        try:
            await self.session.commit()
            await self.session.refresh(model)
        except Exception:
            await self.session.rollback()
            raise

        return model

    async def find_valid_by_token_hash(self, token_hash: str) -> PasswordResetTokenModel | None:
        statement = select(PasswordResetTokenModel).where(
            PasswordResetTokenModel.token_hash == token_hash,
            PasswordResetTokenModel.used_at.is_(None),
            PasswordResetTokenModel.expires_at > datetime.utcnow(),
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def mark_used(self, token_id: int) -> None:
        statement = (
            update(PasswordResetTokenModel)
            .where(PasswordResetTokenModel.id == token_id)
            .values(used_at=datetime.utcnow())
        )

        try:
            await self.session.execute(statement)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

    async def invalidate_for_user(self, user_id: int) -> None:
        statement = (
            update(PasswordResetTokenModel)
            .where(
                PasswordResetTokenModel.user_id == user_id,
                PasswordResetTokenModel.used_at.is_(None),
            )
            .values(used_at=datetime.utcnow())
        )

        try:
            await self.session.execute(statement)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise
