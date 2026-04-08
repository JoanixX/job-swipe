from .assistant_embeddings import router as assistant_router
# from .kawsai_embeddings import router as kawsai_router
from fastapi import APIRouter

router = APIRouter()
router.include_router(assistant_router)
# router.include_router(kawsai_router)