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
from app.adapters.output.orm.models.match_job_student_model import MatchJobStudentModel
from app.adapters.output.orm.models.company_model import CompanyModel
from app.adapters.output.orm.models.skill_model import SkillModel
from app.adapters.output.orm.models.job_offer_required_skill_model import JobOfferRequiredSkillModel
from sqlalchemy.future import select

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
        
        # Excluir ofertas que el estudiante ya ha deslizado (donde student_liked no es nulo)
        stmt = select(MatchJobStudentModel.job_offer_id).where(
            MatchJobStudentModel.student_id == student_id,
            MatchJobStudentModel.student_liked.isnot(None)
        )
        swiped_result = await self.session.execute(stmt)
        swiped_job_ids = set(swiped_result.scalars().all())
        
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
        job_offers_with_embedding = [
            j for j in job_offers 
            if j.embedding and j.id is not None and j.id not in swiped_job_ids
        ]
        
        if not job_offers_with_embedding:
            return {"matches": []}
            
        job_offer_payloads = [
            {"id": j.id, "embedding": j.embedding}
            for j in job_offers_with_embedding
        ]
        student_payload = {"id": student.id, "embedding": student.embedding}
        
        ia_result = await match_best_job_offers(student_payload, job_offer_payloads)
        matches = ia_result.get("matches", [])
        
        # Guardar / Obtener matches en DB y juntar la información rica
        enriched_matches = []
        for m in matches:
            # Threshold Semántico: No mostrar matches de muy baja similitud (< 50%)
            if float(m["score"]) < 0.50:
                continue
                
            job_offer_id = m["job_offer_id"]
            job_offer = next((j for j in job_offers if j.id == job_offer_id), None)
            
            if not job_offer:
                continue
                
            # Fetch company name
            company_name = "Empresa"
            if job_offer.company_id:
                c_stmt = select(CompanyModel.name).where(CompanyModel.id == job_offer.company_id)
                c_res = await self.session.execute(c_stmt)
                c_name = c_res.scalar_one_or_none()
                if c_name:
                    company_name = c_name
            
            # Upsert match in DB so it can be swiped later
            m_stmt = select(MatchJobStudentModel).where(
                MatchJobStudentModel.student_id == student_id,
                MatchJobStudentModel.job_offer_id == job_offer_id
            )
            m_res = await self.session.execute(m_stmt)
            existing_match = m_res.scalar_one_or_none()
            
            if not existing_match:
                new_match = MatchJobStudentModel(
                    student_id=student_id,
                    job_offer_id=job_offer_id,
                    score=m["score"],
                    match_date=datetime.now(),
                    rank=m["rank"],
                    student_liked=None,
                    company_liked=None
                )
                self.session.add(new_match)
                await self.session.flush()
                match_id = new_match.id
            else:
                existing_match.score = m["score"]
                existing_match.rank = m["rank"]
                existing_match.match_date = datetime.now()
                match_id = existing_match.id
                
            # Fetch skills
            s_stmt = select(SkillModel.name).join(
                JobOfferRequiredSkillModel, 
                JobOfferRequiredSkillModel.skill_id == SkillModel.id
            ).where(
                JobOfferRequiredSkillModel.job_offer_id == job_offer_id
            )
            s_res = await self.session.execute(s_stmt)
            skills = [{"name": s} for s in s_res.scalars().all()]
                
            # Enriquecer el dict
            enriched = dict(m)
            enriched["id"] = match_id
            enriched["title"] = job_offer.title
            enriched["company_name"] = company_name
            enriched["description"] = job_offer.description
            enriched["location"] = job_offer.location
            enriched["modality"] = job_offer.modality
            enriched["approximated_salary"] = job_offer.approximated_salary
            enriched["match_score"] = float(m["score"])
            enriched["skills"] = skills
            
            enriched_matches.append(enriched)
            
        await self.session.commit()
        return {"matches": enriched_matches}

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