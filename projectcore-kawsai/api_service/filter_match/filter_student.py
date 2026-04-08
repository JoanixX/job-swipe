from fastapi import APIRouter, Body
from preprocessing.preprocesador import Preprocesador

# conexiones
router = APIRouter()
preprocesador = Preprocesador()

@router.post("/preprocess_student")
async def preprocess_student(payload: dict = Body(...)):
    embedding = preprocesador.get_embedding_student(payload)
    student_id = payload[0].get("id") if payload and isinstance(payload, list) else None
    return {
        "student_id": student_id,
        "status": "processed",
        "stage": 1,
        "embedding": {"vector": embedding[0].tolist()}
    }

@router.post("/preprocess_all_student")
async def preprocess_all_student(students_data: list = Body(...)):
    embeddings = preprocesador.get_embeddings_allstudents(students_data)
    results = []
    for i, student in enumerate(students_data):
        results.append({
            "student_id": student["id"],
            "status": "processed",
            "stage": 1,
            "embedding": {"vector": embeddings[i].tolist()}
        })
    return results