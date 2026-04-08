import pickle
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import anyio
import os
import warnings
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

warnings.filterwarnings("ignore", category=FutureWarning)

client = OpenAI(
    base_url=os.getenv("OPENAI_API_URL"),
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()

load_dotenv()

# Qdrant config desde .env
QDRANT_HOST = os.getenv("QDRANT_HOST")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "fragmentos_pdf")

def buscar_fragmentos_relevantes_qdrant(pregunta_vector, top_k=3):
    client = QdrantClient(QDRANT_HOST, api_key=QDRANT_API_KEY)
    vector = pregunta_vector
    if isinstance(vector, list) and len(vector) == 1 and isinstance(vector[0], list):
        vector = vector[0]
    search_result = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=top_k
    )
    fragmentos = [hit.payload["fragmento"] for hit in search_result]
    return fragmentos

class PreguntarRequest(BaseModel):
    historial: str  # historial texto plano con user: y assistant:

def convertir_historial_texto_a_roles_con_pregunta(historial_texto):
    lineas = [l.strip() for l in historial_texto.strip().split("\n") if l.strip()]
    ultima_linea = lineas[-1]
    assert ultima_linea.startswith("user:"), "Última línea debe ser pregunta del usuario"
    historial_prev = lineas[:-1]

    mensajes = [{
        "role": "system",
        "content": "Eres Chamby 🐹, un asistente para estudiantes. Responde juvenil y profesional con emojis, máximo 50 palabras."
    }]

    for linea in historial_prev:
        if linea.startswith("user:"):
            mensajes.append({"role": "user", "content": linea.replace("user:", "").strip()})
        elif linea.startswith("assistant:"):
            mensajes.append({"role": "assistant", "content": linea.replace("assistant:", "").strip()})

    pregunta_actual = ultima_linea.replace("user:", "").strip()
    return mensajes, pregunta_actual

def preguntar_a_gpt_sync(mensajes):
    respuesta = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=mensajes,
        temperature=0.5,
        max_tokens=80
    )
    return respuesta.choices[0].message.content

async def preguntar_a_gpt_async(historial_texto, fragmentos_relevantes):
    mensajes, pregunta = convertir_historial_texto_a_roles_con_pregunta(historial_texto)
    contexto = "\n\n".join(fragmentos_relevantes)
    mensajes.append({
        "role": "system",
        "content": f"Contexto relevante:\n{contexto}"
    })
    mensajes.append({"role": "user", "content": pregunta})

    respuesta = await anyio.to_thread.run_sync(preguntar_a_gpt_sync, mensajes)
    return respuesta


@app.post("/preguntar")
async def api_preguntar(req: PreguntarRequest):
    historial_texto = req.historial
    pregunta = historial_texto.split("\n")[-1].replace("user:", "").strip()

    from sentence_transformers import SentenceTransformer
    modelo = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    pregunta_vector = modelo.encode([pregunta], convert_to_tensor=False)[0]

    relevantes = buscar_fragmentos_relevantes_qdrant(pregunta_vector, top_k=3)
    respuesta = await preguntar_a_gpt_async(historial_texto, relevantes)
    return {"respuesta": respuesta}
