from enum import Enum

from sqlalchemy import Column, Integer, DateTime, ForeignKey, Date
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.sql import func

from app.infraestructure.database.base import Base


class AgreementStatus(str, Enum):
    pending = 'pending'
    active = 'active'
    completed = 'completed'
    cancelled = 'cancelled'


class AgreementModel(Base):
    __tablename__ = "agreement"

    id = Column(Integer, primary_key=True)

    job_offer_id = Column(
        Integer,
        ForeignKey("job_offer.id"),
        nullable=False,
    )

    student_id = Column(
        Integer,
        ForeignKey("student.id"),
        nullable=False,
    )

    status = Column(
        SqlEnum(
            AgreementStatus,
            name="agreement_status",
        ),
        nullable=False,
        default=AgreementStatus.pending,
    )

    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    deleted_at = Column(DateTime, nullable=True)
