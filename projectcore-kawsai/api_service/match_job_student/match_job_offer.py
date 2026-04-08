from fastapi import APIRouter, Body
import numpy as np
from models.KawsAIModel import KawsAIModel
from datetime import date

router = APIRouter()
model = KawsAIModel()

@router.post("/api/best_job_offers")
async def best_job_offers(payload: dict = Body(...)):
    student = payload.get("student")
    job_offers = payload.get("job_offers", [])

    if not job_offers or not student:
        return {"error": "job_offer y students son requeridos en el payload."}

    embedding_student = np.array(student.get("embedding", {}).get("vector"))
    if embedding_student is None:
        return {"error": "El estudiante no tiene embedding válido."}

    embeddings_job_offers = []
    job_offer_ids = []
    for job_offer in job_offers:
        emb = job_offer.get("embedding", {}).get("vector")
        if emb is not None:
            embeddings_job_offers.append(emb)
            job_offer_ids.append(job_offer.get("id"))
    if not embeddings_job_offers:
        return {"error": "Ninguna oferta de trabajo tiene embedding válido."}

    embeddings_job_offers = np.array(embeddings_job_offers)
    embedding_student = embedding_student.reshape(1, -1)

    scores, indexes = model.get_best_job_offers(embeddings_job_offers, embedding_student)

    results = []
    for rank, (idx, score) in enumerate(zip(indexes, scores), 1):
        results.append({
            "student_id": student.get("id"),
            "job_offer_id": job_offer_ids[idx],
            "score": float(score),
            "match_date": date.today().isoformat(),
            "rank": rank
        })

    return {"matches": results}