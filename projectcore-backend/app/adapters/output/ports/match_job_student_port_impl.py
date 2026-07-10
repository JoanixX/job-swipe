from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.domain.entities.match_job_student import MatchJobStudent
from app.adapters.output.orm.repositories.match_job_student_repository_impl import MatchJobStudentRepositoryImpl
from app.application.ports.match_job_student_port import MatchJobStudentPort

from app.adapters.output.orm.repositories.job_offer_repository_impl import JobOfferRepositoryImpl
from app.adapters.output.orm.repositories.student_repository_impl import StudentRepositoryImpl
from app.adapters.output.orm.repositories.filter_match_repository_impl import FilterMatchRepositoryImpl
from app.adapters.output.ports.filter_match_port_impl import FilterMatchPortImpl
from app.infraestructure.ai_client.ai_connection import match_best_job_offers, match_best_students

class MatchJobStudentPortImpl(MatchJobStudentPort):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.match_job_student_repo = MatchJobStudentRepositoryImpl(session)
        self.filter_match_repo = FilterMatchRepositoryImpl(session)

    async def register_match_job_student(self, match_job_student_data: Dict[str, Any]) -> MatchJobStudent:
        if 'match_date' not in match_job_student_data:
            match_job_student_data['match_date'] = datetime.now()
        if 'updated_at' not in match_job_student_data:
            match_job_student_data['updated_at'] = datetime.now()
        entity = MatchJobStudent(
            id=0,
            student_id=match_job_student_data["student_id"],
            job_offer_id=match_job_student_data["job_offer_id"],
            score=match_job_student_data["score"],
            match_date=match_job_student_data["match_date"],
            rank=match_job_student_data.get("rank", 1),
            updated_at=match_job_student_data["updated_at"],
            deleted_at=match_job_student_data.get("deleted_at")
        )
        # Guardar en la base de datos
        saved = await self.match_job_student_repo.save(entity)
        return saved

    async def match_job_student(self, student_id: int):
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)

        student_repo = StudentRepositoryImpl(self.session)
        student = await student_repo.find_by_id(student_id)
        
        if not student or not student.embedding:
            logger.info(f"El estudiante {student_id} no tiene embedding, intentando generarlo...")
            filter_match_port = FilterMatchPortImpl(self.session)
            res = await filter_match_port.preprocess_student(student_id)
            if res and res.get("embedding"):
                student.embedding = res.get("embedding")
                await student_repo.update(student)
            
            student = await student_repo.find_by_id(student_id)
            if not student or not student.embedding:
                raise ValueError("El estudiante no tiene embedding disponible y no se pudo generar")
                
        # Obtener todas las ofertas con embedding
        job_offer_repo = JobOfferRepositoryImpl(self.session)
        job_offers = await job_offer_repo.get_all()
        
        # Auto-generar embeddings para ofertas que no lo tienen
        for j in job_offers:
            if not j.embedding and j.id is not None:
                logger.info(f"La oferta candidata {j.id} no tiene embedding, generándolo...")
                filter_match_port = FilterMatchPortImpl(self.session)
                res = await filter_match_port.preprocess_job_offer(j.id)
                if res and res.get("embedding"):
                    j.embedding = res.get("embedding")
                    await job_offer_repo.update(j)
                    
        job_offers = await job_offer_repo.get_all()
        job_offers_with_embedding = [j for j in job_offers if j.embedding and j.id is not None]
        
        if not job_offers_with_embedding:
            raise ValueError("No hay ofertas de trabajo con embeddings para hacer match")
            
        job_offer_payloads = [
            {"id": j.id, "embedding": j.embedding}
            for j in job_offers_with_embedding
        ]
        student_payload = {"id": student.id, "embedding": student.embedding}
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)
        logger.info(f"Payload IA student: {student_payload}")
        logger.info(f"Payload IA job_offers: {job_offer_payloads}")
        ia_result = await match_best_job_offers(student_payload, job_offer_payloads)
        return ia_result

    async def match_student_job(self, job_offer_id: int):
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)

        job_offer_repo = JobOfferRepositoryImpl(self.session)
        job_offer = await job_offer_repo.find_by_id(job_offer_id)
        
        if not job_offer or not job_offer.embedding:
            logger.info(f"La oferta {job_offer_id} no tiene embedding, intentando generarlo...")
            filter_match_port = FilterMatchPortImpl(self.session)
            res = await filter_match_port.preprocess_job_offer(job_offer_id)
            if res and res.get("embedding"):
                job_offer.embedding = res.get("embedding")
                await job_offer_repo.update(job_offer)
            
            job_offer = await job_offer_repo.find_by_id(job_offer_id)
            if not job_offer or not job_offer.embedding:
                raise ValueError("La oferta no tiene embedding disponible y no se pudo generar")
                
        # Obtener todos los estudiantes con embedding
        student_repo = StudentRepositoryImpl(self.session)
        students = await student_repo.get_all()
        
        # Auto-generar embeddings para estudiantes que no lo tienen
        for s in students:
            if not s.embedding and s.id is not None:
                logger.info(f"El estudiante candidato {s.id} no tiene embedding, generándolo...")
                filter_match_port = FilterMatchPortImpl(self.session)
                res = await filter_match_port.preprocess_student(s.id)
                if res and res.get("embedding"):
                    s.embedding = res.get("embedding")
                    await student_repo.update(s)
                    
        students = await student_repo.get_all()
        students_with_embedding = [s for s in students if s.embedding and s.id is not None]
        
        if not students_with_embedding:
            raise ValueError("No hay estudiantes con embeddings para hacer match")
            
        student_payloads = [
            {"id": s.id, "embedding": s.embedding}
            for s in students_with_embedding
        ]
        job_offer_payload = {"id": job_offer.id, "embedding": job_offer.embedding}
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)
        logger.info(f"Payload IA job_offer: {job_offer_payload}")
        logger.info(f"Payload IA students: {student_payloads}")
        ia_result = await match_best_students(job_offer_payload, student_payloads)
        return ia_result