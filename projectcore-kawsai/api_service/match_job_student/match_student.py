from fastapi import APIRouter, Body
import numpy as np
from models.KawsAIModel import KawsAIModel
from datetime import date

router = APIRouter()
model = KawsAIModel()

@router.post("/api/best_students")
async def best_students(payload: dict = Body(...)):
    job_offer = payload.get("job_offer")
    students = payload.get("students", [])

    if not job_offer or not students:
        return {"error": "job_offer y students son requeridos en el payload."}

    embedding_offer = np.array(job_offer.get("embedding", {}).get("vector"))
    if embedding_offer is None:
        return {"error": "La oferta no tiene embedding válido."}

    embeddings_students = []
    student_ids = []
    for student in students:
        emb = student.get("embedding", {}).get("vector")
        if emb is not None:
            embeddings_students.append(emb)
            student_ids.append(student.get("id"))
    if not embeddings_students:
        return {"error": "Ningún estudiante tiene embedding válido."}

    embeddings_students = np.array(embeddings_students)
    embedding_offer = embedding_offer.reshape(1, -1)

    scores, indexes = model.get_best_students(embeddings_students, embedding_offer)

    results = []
    for rank, (idx, score) in enumerate(zip(indexes, scores), 1):
        results.append({
            "student_id": student_ids[idx],
            "job_offer_id": job_offer.get("id"),
            "score": float(score),
            "match_date": date.today().isoformat(),
            "rank": rank
        })

    return {"matches": results}