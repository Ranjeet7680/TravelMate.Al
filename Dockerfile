# ===================================================
# Stage 1: Build the React 19 Frontend with Node.js
# ===================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ===================================================
# Stage 2: Production FastAPI Multi-Agent Engine
# ===================================================
FROM python:3.11-slim AS production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    STATIC_DIR=/app/static

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source & datasets
COPY backend/ ./backend/
COPY datasets/ ./datasets/
COPY assets/ ./assets/

# Copy built frontend assets from Stage 1 into /app/static
COPY --from=frontend-builder /app/frontend/dist /app/static

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
