from fastapi import APIRouter, Body
from funciones import buscar_fragmentos_relevantes_qdrant, preguntar_a_gpt_async
from sentence_transformers import SentenceTransformer
import httpx
from config import BACKEND_API_URL

router = APIRouter()

@router.post("/webhook/n8n")
async def n8n_webhook(payload: dict = Body(...)):
    phone_number = payload.get("phone_number")
    message = payload.get("message")
    message_order = payload.get("message_order")
    message_role = payload.get("message_role", "user")
    historial = payload.get("historial", "")

    #generación del embedding
    modelo = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    pregunta_vector = modelo.encode([message], convert_to_tensor=False)

    #buscar fragmentos relevantes
    relevantes = buscar_fragmentos_relevantes_qdrant(pregunta_vector, top_k=3)

    #generar respuesta usando GPT
    respuesta = await preguntar_a_gpt_async(historial, relevantes)

    user_chat_data = {
        "phone_number": phone_number,
        "message_order": message_order,
        "message_role": "user",
        "message": message
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BACKEND_API_URL}/api/register/chat_history", json=user_chat_data)
            response.raise_for_status()
        except Exception as e:
            print(f"Error saving user chat history: {e}")

    assistant_chat_data = {
        "phone_number": phone_number,
        "message_order": message_order + 1,
        "message_role": "assistant",
        "message": respuesta
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BACKEND_API_URL}/api/register/chat_history", json=assistant_chat_data)
            response.raise_for_status()
        except Exception as e:
            print(f"Error saving assistant chat history: {e}")

    #save embedding to backend
    embedding_data = {
        "chat_id": f"{phone_number}_{message_order}",
        "vector": pregunta_vector[0].tolist()
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BACKEND_API_URL}/api/embeddings/save", json=embedding_data)
            response.raise_for_status()
        except Exception as e:
            print(f"Error saving embedding: {e}")

    return {
        "phone_number": phone_number,
        "message": respuesta,
        "message_order": message_order + 1,
        "message_role": "assistant"
    }
