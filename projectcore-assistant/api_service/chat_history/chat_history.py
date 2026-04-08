from fastapi import APIRouter, HTTPException, Body
from api_service.chat_history.backend_client import send_chat_history_to_backend

router = APIRouter()

@router.post("/chat_history")
async def chat_history(payload: dict = Body(...)):
    try:
        backend_response = await send_chat_history_to_backend(payload)
        return {"status": "success", "backend_response": backend_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))