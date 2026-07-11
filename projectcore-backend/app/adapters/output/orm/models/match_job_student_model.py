from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, Numeric, SmallInteger, UniqueConstraint, )
from sqlalchemy.sql import func

from app.infraestructure.database.base import Base


class MatchJobStudentModel(Base):
    __tablename__ = "match_job_student"

    id = Column(Integer, primary_key=True, )

    student_id = Column(Integer, ForeignKey("student.id"), nullable=False, )

    job_offer_id = Column(Integer, ForeignKey("job_offer.id"), nullable=False, )

    score = Column(Numeric(5, 2), nullable=False, )

    match_date = Column(DateTime, nullable=False, )

    rank = Column(SmallInteger, nullable=False, )

    student_liked = Column(Boolean, nullable=True, )

    company_liked = Column(Boolean, nullable=True, )

    created_at = Column(DateTime, nullable=False, server_default=func.now(), )

    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now(), )

    deleted_at = Column(DateTime, nullable=True, )

    __table_args__ = (UniqueConstraint("student_id", "job_offer_id", name="uq_match_student_job_offer", ),)
