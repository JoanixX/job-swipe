import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.infraestructure.database.connection import get_session

from app.adapters.input.fastapi.schemas.embeddings.assistant_embeddings_schema import (
    AssistantEmbeddingsRequest, AssistantEmbeddingsResponse
)
from app.application.factories.embeddings.assistant_embeddings_factory import AssistantEmbeddingsFactory

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/assistant/embeddings/save", response_model=AssistantEmbeddingsResponse, tags=["Vectorial Database"])
async def save_embedding(request: Request, req: AssistantEmbeddingsRequest, session: AsyncSession = Depends(get_session)):
    try:
        body = await request.body()
        logger.info(f"Body recibido: {body.decode()}")
        logger.info(f"Guardando embedding para chat_id: {req.chat_id}")

        service = AssistantEmbeddingsFactory(session).build_service()
        await service.save(req.chat_id, req.vector)

        logger.info("Embedding guardado correctamente")
        return JSONResponse(content={"status": "saved"})
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error interno del servidor: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/assistant/embeddings/search", response_model=AssistantEmbeddingsResponse, tags=["Vectorial Database"])
async def search_embedding(request: Request, req: AssistantEmbeddingsRequest, session: AsyncSession = Depends(get_session)):
    try:
        body = await request.body()
        logger.info(f"Body recibido: {body.decode()}")
        logger.info(f"Buscando embeddings con vector: {req.vector[:5]}... (truncado)")

        service = AssistantEmbeddingsFactory(session).build_service()
        matches = await service.search(req.vector, req.k)

        logger.info(f"{len(matches)} coincidencias encontradas")
        return JSONResponse(content={"matches": matches, "status": "ok"})
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error interno del servidor: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")