import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine

# Need to ensure DATABASE_URL is set before connection is initialized
# Usually connection.py reads os.getenv("DATABASE_URL")
if not os.getenv("DATABASE_URL"):
    os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:postgres@localhost:5432/jobswipe"

from app.infraestructure.database.connection import engine
from app.infraestructure.database.base import Base

# Import all models to ensure they are registered with Base.metadata
from app.adapters.output.orm.models.agreement_model import *
from app.adapters.output.orm.models.app_user_model import *
from app.adapters.output.orm.models.area_model import *
from app.adapters.output.orm.models.chat_history_model import *
from app.adapters.output.orm.models.company_area_model import *
from app.adapters.output.orm.models.company_model import *
from app.adapters.output.orm.models.experience_detail_model import *
from app.adapters.output.orm.models.external_link_model import *
from app.adapters.output.orm.models.filter_match_model import *
from app.adapters.output.orm.models.interest_model import *
from app.adapters.output.orm.models.job_offer_area_model import *
from app.adapters.output.orm.models.job_offer_model import *
from app.adapters.output.orm.models.job_offer_required_skill_model import *
from app.adapters.output.orm.models.match_job_student_model import *
from app.adapters.output.orm.models.password_reset_token_model import *
from app.adapters.output.orm.models.skill_model import *
from app.adapters.output.orm.models.student_interest_model import *
from app.adapters.output.orm.models.student_model import *
from app.adapters.output.orm.models.student_skill_model import *


async def init_models():
    async with engine.begin() as conn:
        print("Creating all tables in the database...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_models())
