# Use the official Python runtime image
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS base

# Set environment variables
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

WORKDIR /app

EXPOSE 8000

COPY pyproject.toml .
COPY uv.lock .

ENV PATH="/app/.venv/bin:$PATH"
ENV PATH=/root/.local/bin:$PATH

FROM base AS test

RUN uv sync --frozen --no-cache

# Copy the project into the image
COPY . .

CMD ["pytest"]

FROM base AS prod

RUN uv sync --frozen --no-cache --no-dev

# Copy the project into the image
COPY . .

WORKDIR /app/regru

CMD ["uvicorn", "regru.asgi:application", "--host", "0.0.0.0"]
