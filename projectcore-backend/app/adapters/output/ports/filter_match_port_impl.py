import logging
from datetime import date, datetime
from typing import Dict, Any, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.adapters.output.orm.repositories.filter_match_repository_impl import FilterMatchRepositoryImpl
from app.adapters.output.orm.repositories.job_offer_repository_impl import JobOfferRepositoryImpl
from app.adapters.output.orm.repositories.student_repository_impl import StudentRepositoryImpl
from app.application.ports.filter_match_port import FilterMatchPort
from app.domain.entities.filter_match import FilterMatch
from app.infraestructure.ai_client.ai_connection import preprocess_all_job_offers, preprocess_all_students

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FilterMatchPortImpl(FilterMatchPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.filter_match_repo = FilterMatchRepositoryImpl(session)
        self.job_offer_repo = JobOfferRepositoryImpl(session)
        self.student_repo = StudentRepositoryImpl(session)

    @staticmethod
    def _make_json_serializable(value):
        if isinstance(value, (date, datetime)):
            return value.isoformat()

        if isinstance(value, dict):
            return {key: FilterMatchPortImpl._make_json_serializable(item) for key, item in value.items()}

        if isinstance(value, list):
            return [FilterMatchPortImpl._make_json_serializable(item) for item in value]

        return value

    async def preprocess_all_job_offers(self, job_offer_ids: List[int], ) -> List[dict]:
        enriched = await self.job_offer_repo.get_enriched_job_offers()

        candidates = [job_offer for job_offer in enriched if job_offer.get("id") in job_offer_ids]

        if not candidates:
            return []

        candidates = self._make_json_serializable(candidates)

        ia_results = await preprocess_all_job_offers(candidates)

        return ia_results if ia_results else []

    async def preprocess_job_offer(self, job_offer_id: int, ) -> dict:
        enriched = await self.job_offer_repo.get_enriched_job_offers()

        job_offer_data = next((job_offer for job_offer in enriched if job_offer.get("id") == job_offer_id), None, )

        if not job_offer_data:
            return {"job_offer_id": job_offer_id, "status": "pending", "stage": 0, }

        job_offer_data = self._make_json_serializable(job_offer_data)

        ia_results = await preprocess_all_job_offers([job_offer_data])

        return (ia_results[0] if ia_results else {"job_offer_id": job_offer_id, "status": "pending", "stage": 0, })

    async def preprocess_all_students(self, student_ids: List[int], ) -> List[dict]:
        enriched = await self.student_repo.get_enriched_students()

        candidates = [student for student in enriched if student.get("id") in student_ids]

        if not candidates:
            return []

        candidates = self._make_json_serializable(candidates)

        ia_results = await preprocess_all_students(candidates)

        return ia_results if ia_results else []

    async def preprocess_student(self, student_id: int, ) -> dict:
        enriched = await self.student_repo.get_enriched_students()

        student_data = next((student for student in enriched if student.get("id") == student_id), None, )

        if not student_data:
            return {"student_id": student_id, "status": "pending", "stage": 0, }

        student_data = self._make_json_serializable(student_data)

        ia_results = await preprocess_all_students([student_data])

        return (ia_results[0] if ia_results else {"student_id": student_id, "status": "pending", "stage": 0, })

    async def register_filter_match_student(self, student_id: int, filter_match_data: Dict[str, Any]) -> FilterMatch:
        if 'created_at' not in filter_match_data:
            filter_match_data['created_at'] = datetime.now()
        if 'updated_at' not in filter_match_data:
            filter_match_data['updated_at'] = datetime.now()
        filter_match = FilterMatch(id=0, job_offer_id=filter_match_data.get("job_offer_id", None),
                                   student_id=student_id, status=filter_match_data["status"],
                                   stage=filter_match_data["stage"], created_at=filter_match_data['created_at'],
                                   updated_at=filter_match_data['updated_at'],
                                   deleted_at=filter_match_data.get('deleted_at'))
        saved_filter_match = await self.filter_match_repo.save_filtered_student(filter_match)
        return saved_filter_match

    async def register_filter_match_job_offer(self, job_offer_id: int,
                                              filter_match_data: Dict[str, Any]) -> FilterMatch:
        if 'created_at' not in filter_match_data:
            filter_match_data['created_at'] = datetime.now()
        if 'updated_at' not in filter_match_data:
            filter_match_data['updated_at'] = datetime.now()
        filter_match = FilterMatch(id=0, job_offer_id=job_offer_id,
                                   student_id=filter_match_data.get("student_id", None),
                                   status=filter_match_data["status"], stage=filter_match_data["stage"],
                                   created_at=filter_match_data['created_at'],
                                   updated_at=filter_match_data['updated_at'],
                                   deleted_at=filter_match_data.get('deleted_at'))
        saved_filter_match = await self.filter_match_repo.save_filtered_job_offer(filter_match)
        return saved_filter_match
