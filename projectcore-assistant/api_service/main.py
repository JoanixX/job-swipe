from fastapi import FastAPI
from api_service.chat_history.chat_history import router as chat_history_router
from api_service.webhook.n8n_webhook import router as n8n_webhook_router
from funciones import app as funciones_app

app = FastAPI()
app.include_router(chat_history_router)
app.include_router(n8n_webhook_router)
app.mount("/", funciones_app)