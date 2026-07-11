import asyncio

from app.infraestructure.database.base import Base
from app.infraestructure.database.connection import engine

# Importa todos los modelos para que Base.metadata los conozca.
from app.adapters.output.orm.models import agreement_model
from app.adapters.output.orm.models import student_model
from app.adapters.output.orm.models import job_offer_model


async def create_tables():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_tables())
