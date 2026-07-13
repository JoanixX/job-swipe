# Plataforma de Ranking de Candidatos

Plataforma web para la gestión y evaluación de candidatos basada en inteligencia artificial. Permite a los reclutadores subir CVs, realizar entrevistas simuladas y obtener un ranking automatizado de los mejores perfiles para cada oferta laboral.

## Características Principales

- **Gestión de Candidatos**: Carga y almacenamiento seguro de CVs en la nube.
- **Entrevistas IA**: Chat en tiempo real con un asistente virtual que evalúa competencias técnicas y blandas.
- **Ranking Inteligente**: Algoritmo de puntuación que clasifica a los candidatos según su desempeño y adecuación al puesto.
- **Análisis de CV**: Extracción automática de información relevante de los documentos PDF.

## Stack Tecnológico

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: TypeScript
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconos**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Lenguaje**: Python
- **Persistencia**: Caché en memoria (Volatile)
- **Seguridad**: CORS configurado para desarrollo

## Estructura del Proyecto

```
job-swipe/
├── frontend/             # Interfaz de usuario (React)
├── backend/              # API y lógica de negocio (FastAPI)
└── README.md             # Documentación principal
```

## Instalación y Ejecución

### Requisitos Previos
- Node.js (v18+)
- Python (v3.8+)
- npm o yarn

### 1. Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el servidor
uvicorn main:app --reload
```

El servidor estará disponible en `http://localhost:8000`.

### 2. Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Notas de Desarrollo

- **Estado en Memoria**: Actualmente se guarda en memoria (RAM) por **eficiencia de costes** y simplicidad de despliegue inicial.
- **Identificación**: El frontend genera un UUID persistente en el `localStorage` y lo envía en cada petición.
- **Seguridad**: CORS configurado para permitir cualquier origen durante el desarrollo.

## Arquitectura Futura

Se utilizó caché para esta demo por eficiencia de costes, pero el sistema está diseñado con **Inyección de Dependencias** para "swappear" el repositorio por **PostgreSQL/Redis** en 5 minutos. Esto garantiza que la lógica de negocio permanezca desacoplada de la implementación de la persistencia.
