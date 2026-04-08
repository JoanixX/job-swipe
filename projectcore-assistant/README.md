# Assistant - Chatbot oficial de ProjectCore

## Cómo ejecutar Assistant localmente

1. **Clona el repositorio**
	```bash
	git clone <URL_DEL_REPO>
	cd chambeya-assistant
	```

2. **Crea el entorno virtual (venv)**
	```bash
	python -m venv venv
	```

3. **Activa el entorno virtual**
	- En Windows:
	  ```bash
	  venv\Scripts\activate
	  ```
	- En Linux/Mac:
	  ```bash
	  source venv/bin/activate
	  ```

4. **Instala las dependencias**
	```bash
	pip install -r requirements.txt
	```

5. **Configura las variables de entorno**
	- Crea un archivo `.env` en la raíz y agrega tus claves y URLs:
	  ```env
	  OPENROUTER_API_KEY=tu_api_key
	  BACKEND_API_URL=tu_url_de_backend
	  N8N=tu_url_n8n
	  EVOLUTION_API=tu_url_evolution
	  ```

6. **Inicia el servidor FastAPI**
	```bash
	uvicorn api_service.main:app --reload
	```
	(Ajusta el módulo si usas otro archivo principal)

7. **Prueba el endpoint**
	- Usa Postman, Insomnia o un script Python para enviar datos a `/chat_history`.

---

**Listo!** Ahora puedes desarrollar y probar Assistant localmente.
# Assistant - Chatbot oficial de ProjectCore
