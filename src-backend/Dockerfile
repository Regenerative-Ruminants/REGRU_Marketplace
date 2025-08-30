# Use the official Python runtime image
ARG PYTHON_VERSION=3.13
FROM ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim AS base

# Set environment variables
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

WORKDIR /app

EXPOSE 8000

ARG HOST_UID=1000
RUN useradd -s /bin/bash -m user --uid ${HOST_UID}

COPY pyproject.toml .
COPY uv.lock .

ENV PATH="/app/.venv/bin:$PATH"
ENV PATH=/root/.local/bin:$PATH

FROM base AS test

RUN uv sync --frozen --no-cache

# Copy the project into the image
COPY . .

ENV RUFF_CACHE_DIR=/home/user/.ruff_cache
USER user

CMD ["pytest"]

FROM base AS prod

RUN uv sync --frozen --no-cache --no-dev

# Copy the project into the image
COPY . .
RUN chmod 0555 run.sh

USER user
