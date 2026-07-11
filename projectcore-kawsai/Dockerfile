FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    && python -m spacy download es_core_news_sm

COPY . .

EXPOSE 8001

CMD ["uvicorn", "api_service.main:app", "--host", "0.0.0.0", "--port", "8001"]