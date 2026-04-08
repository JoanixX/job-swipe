from fastapi import APIRouter, Body
from preprocessing.preprocesador import Preprocesador

# conexiones
router = APIRouter()
preprocesador = Preprocesador()

@router.post("/preprocess_job_offer")
async def preprocess_job_offer(payload: list = Body(...)):
    embedding = preprocesador.get_embedding_offer(payload)
    job_offer_id = payload[0].get("id") if payload and isinstance(payload, list) else None
    return {
        "job_offer_id": job_offer_id,
        "status": "processed",
        "stage": 1,
        "embedding": {"vector": embedding[0].tolist()}
    }

@router.post("/preprocess_all_job_offer")
async def preprocess_all_job_offer(job_offers_data: list = Body(...)):
    embeddings = preprocesador.get_embeddings_alloffers(job_offers_data)
    results = []
    for i, job_offer in enumerate(job_offers_data):
        results.append({
            "job_offer_id": job_offer["id"],
            "status": "processed",
            "stage": 1,
            "embedding": {"vector": embeddings[i].tolist()}
        })
    return results