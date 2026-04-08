import httpx
from config import BACKEND_API_URL

async def send_chat_history_to_backend(payload: dict):
    if not BACKEND_API_URL:
        raise ValueError("BACKEND_API_URL not set in environment")
    backend_url = f"{BACKEND_API_URL}/chat_history"
    async with httpx.AsyncClient() as client:
        response = await client.post(backend_url, json=payload)
    response.raise_for_status()
    return response.json()