from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.infraestructure.database.base import Base


class CompanyModel(Base):
    __tablename__ = "company"

    id = Column(Integer, primary_key=True, )

    name = Column(String(100), nullable=False, )

    industry = Column(String(50), nullable=False, )

    company_culture = Column(String(100), nullable=False, )

    contact_email = Column(String(100), nullable=True, )

    phone = Column(String(20), nullable=True, )

    website = Column(String(100), nullable=True, )

    location = Column(String(100), nullable=True, )

    created_at = Column(DateTime, nullable=False, server_default=func.now(), )

    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now(), )

    deleted_at = Column(DateTime, nullable=True, )
