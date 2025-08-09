# Use the official Python runtime image
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS base

# Set environment variables
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock .

RUN uv sync

# Copy the project into the image
COPY . .

ENV PATH="/app/.venv/bin:$PATH"
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

WORKDIR /app/regru-api

CMD ["uvicorn", "regru.asgi:application", "--host", "0.0.0.0"]
