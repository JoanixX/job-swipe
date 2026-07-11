from fastapi import APIRouter, Body

from preprocessing.preprocesador import Preprocesador

router = APIRouter()
preprocesador = Preprocesador()


@router.post("/preprocess_student")
async def preprocess_student(payload: dict = Body(...)):
    embedding = preprocesador.get_embedding_student(payload)

    return {
        "student_id": payload.get("id"),
        "status": "processed",
        "stage": 1,
        "embedding": {
            "vector": embedding[0].tolist(),
        },
    }


@router.post("/preprocess_all_student")
async def preprocess_all_student(
    students_data: list = Body(...),
):
    embeddings = preprocesador.get_embeddings_allstudents(
        students_data
    )

    results = []

    for index, student in enumerate(students_data):
        results.append(
            {
                "student_id": student["id"],
                "status": "processed",
                "stage": 1,
                "embedding": {
                    "vector": embeddings[index].tolist(),
                },
            }
        )

    return results