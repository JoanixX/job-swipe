from sqlalchemy import (JSON, Column, Date, DateTime, ForeignKey, Integer, SmallInteger, String, )
from sqlalchemy.sql import func

from app.infraestructure.database.base import Base


class JobOfferModel(Base):
    __tablename__ = "job_offer"

    id = Column(Integer, primary_key=True)

    company_id = Column(Integer, ForeignKey("company.id"), nullable=False, )

    title = Column(String(60), nullable=False, )

    description = Column(String(200), nullable=False, )

    required_hours = Column(SmallInteger, nullable=False, )

    approximated_salary = Column(Integer, nullable=False, )

    duration = Column(SmallInteger, nullable=False, )

    location = Column(String(255), nullable=True, )

    start_date = Column(Date, nullable=False, )

    modality = Column(SmallInteger, nullable=False, )

    embedding = Column(JSON, nullable=True, )

    created_at = Column(DateTime, nullable=False, server_default=func.now(), )

    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now(), )

    deleted_at = Column(DateTime, nullable=True, )
