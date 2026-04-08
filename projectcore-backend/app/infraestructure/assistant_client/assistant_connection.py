import os
import httpx

ASSISTANT_RAG_URL = os.getenv("ASSISTANT_RAG_URL")

async def obtener_respuesta_ia(historial: str):
    url = f"{ASSISTANT_RAG_URL}/preguntar"
    payload = {"historial": historial}
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        return response.json()["respuesta"]