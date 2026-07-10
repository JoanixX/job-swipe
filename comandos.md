# Comandos para inicializar JobSwipe

A continuación, encontrarás los comandos necesarios para poner a correr todas las piezas del proyecto JobSwipe en tu entorno local de desarrollo. Te recomiendo abrir múltiples terminales para ejecutar los servicios en paralelo.

---

## 1. Backend, Base de Datos (PostgreSQL) y Qdrant

El backend y las bases de datos están configurados para correr mediante Docker Compose.

**Ruta:** `CODIGO/job-swipe/`
```bash
# Entrar a la carpeta raíz del proyecto
cd c:\Users\USER\Documents\2026-1\GerenciaComputacion\CODIGO\job-swipe

# Construir e inicializar los contenedores (PostgreSQL, Qdrant y FastAPI Backend)
docker-compose up --build
```
> *Nota: Si solo deseas correrlo en segundo plano, añade la bandera `-d` (`docker-compose up -d --build`). El backend estará disponible en `http://localhost:8000`.*

---

## 2. Frontend (React / Vite)

El frontend está desarrollado con Vite y React. Requiere la instalación de dependencias antes de correr.

**Ruta:** `CODIGO/job-swipe/projectcore-frontend/`
```bash
# Entrar a la carpeta del frontend
cd c:\Users\USER\Documents\2026-1\GerenciaComputacion\CODIGO\job-swipe\projectcore-frontend

# Instalar las dependencias (solo es necesario la primera vez o si cambian paquetes)
npm install

# Inicializar el servidor de desarrollo
npm run dev
```
> *Nota: Una vez inicializado, la consola mostrará la URL local (usualmente `http://localhost:5173`) donde podrás visualizar la aplicación.*

---

## 3. Servicios de IA y Kawsai (Opcional según entorno)

Si necesitas levantar localmente los preprocesadores de IA (Sentence Transformers, procesamiento de PDFs, y conexiones de WhatsApp/n8n) que no estén cubiertos por el `docker-compose` de la API principal, deberás ejecutar los módulos de Python de manera independiente.

**Ruta:** `CODIGO/job-swipe/projectcore-kawsai/` y `CODIGO/job-swipe/projectcore-assistant/`
```bash
# Ejemplo: Para inicializar dependencias de Python (Asegúrate de tener un entorno virtual activado si es posible)
cd c:\Users\USER\Documents\2026-1\GerenciaComputacion\CODIGO\job-swipe\projectcore-kawsai
pip install -r requirements.txt # (Si existe un requirements.txt)

# Para correr los scripts de análisis o seeders:
python analyze_metrics.py
```

---

## Resumen Rápido (TL;DR)

Abre **2 terminales** y ejecuta:

**Terminal 1:**
```bash
cd c:\Users\USER\Documents\2026-1\GerenciaComputacion\CODIGO\job-swipe
docker-compose up
```

**Terminal 2:**
```bash
cd c:\Users\USER\Documents\2026-1\GerenciaComputacion\CODIGO\job-swipe\projectcore-frontend
npm install
npm run dev
```
