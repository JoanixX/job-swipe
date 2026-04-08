from fastapi import APIRouter, Depends, HTTPException
from app.infraestructure.assistant_client.assistant_connection import obtener_respuesta_ia
from sqlalchemy.ext.asyncio import AsyncSession
from app.infraestructure.database.connection import get_session
from app.application.factories.chat_history_factory import ChatHistoryUseCaseFactory

router = APIRouter()

@router.post("/preguntar_ia/{chat_history_phone_number}")
async def preguntar_ia_endpoint(chat_history_phone_number: str, session: AsyncSession = Depends(get_session)):
    try:
        chat_history_use_case = ChatHistoryUseCaseFactory(session).build()
        chat_history_list = await chat_history_use_case.get_chat_history(chat_history_phone_number)
        # Construir historialTexto como en n8n
        historial_texto = "\n".join([
            f"{msg.message_role}: {msg.message}" for msg in chat_history_list
        ])
        respuesta = await obtener_respuesta_ia(historial_texto)
        return {"respuesta": respuesta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")