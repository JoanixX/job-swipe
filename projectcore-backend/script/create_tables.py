import asyncio
import importlib
import pkgutil

from sqlalchemy import text

from app.adapters.output.orm import models
from app.infraestructure.database.base import Base
from app.infraestructure.database.connection import engine


def import_all_models() -> None:
    """
    Importa todos los módulos ORM para que SQLAlchemy registre
    sus tablas en Base.metadata.
    """
    for module_info in pkgutil.walk_packages(models.__path__, prefix=f"{models.__name__}.", ):
        importlib.import_module(module_info.name)


async def create_tables() -> None:
    import_all_models()

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

        result = await connection.execute(text("""
                                               SELECT table_name
                                               FROM information_schema.tables
                                               WHERE table_schema = 'public'
                                               ORDER BY table_name
                                               """))

        tables = result.scalars().all()

    await engine.dispose()

    print("Tablas creadas o verificadas correctamente:")
    for table in tables:
        print(f"- {table}")


if __name__ == "__main__":
    asyncio.run(create_tables())
