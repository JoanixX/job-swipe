from datetime import datetime
from typing import Optional


class MatchJobStudent:
    def __init__(self, id: int, student_id: int, job_offer_id: int, score: float, match_date: datetime, rank: int,
                 student_liked: Optional[bool] = None, company_liked: Optional[bool] = None,
                 created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None,
                 deleted_at: Optional[datetime] = None, ):
        self.id = id
        self.student_id = student_id
        self.job_offer_id = job_offer_id
        self.score = score
        self.match_date = match_date
        self.rank = rank
        self.student_liked = student_liked
        self.company_liked = company_liked
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
