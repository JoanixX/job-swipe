import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.factories.app_user_factory import AppUserUseCaseFactory
from app.infraestructure.database.connection import get_session

router = APIRouter()

logger = logging.getLogger(__name__)

UPLOADS_DIR = Path("uploads/cv")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

MAX_CV_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/upload/cv/{user_id}", response_model=dict, tags=["File Upload"], )
async def upload_cv(user_id: int, file: UploadFile = File(...), session: AsyncSession = Depends(get_session), ):
    try:
        if file.content_type != "application/pdf":
            raise ValueError("Solo se permiten archivos PDF")

        content = await file.read()

        if len(content) > MAX_CV_SIZE_BYTES:
            raise ValueError("El archivo supera el tamaño máximo de 5 MB")

        # Verificación de firma del archivo: un PDF real empieza con %PDF
        if not content.startswith(b"%PDF"):
            raise ValueError("El archivo no es un PDF válido")

        # Nunca se usa el nombre original del cliente para evitar path traversal
        filename = f"cv_user_{user_id}_{uuid.uuid4().hex}.pdf"
        file_path = UPLOADS_DIR / filename
        file_path.write_bytes(content)

        cv_url = f"/uploads/cv/{filename}"

        use_case = AppUserUseCaseFactory(session).build()

        try:
            await use_case.update_user(user_id, {"cv_url": cv_url}, )
        except ValueError:
            # Si el usuario no existe, se elimina el archivo huérfano
            file_path.unlink(missing_ok=True)
            raise

        return {"success": True, "cv_url": cv_url, "message": "CV subido correctamente", }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error), ) from error

    except Exception as error:
        logger.error("Error al subir el CV", exc_info=True, )
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {error}", ) from error
