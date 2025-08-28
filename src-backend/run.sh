#!/bin/bash

API_KEEP_ALIVE=${API_KEEP_ALIVE:-65}
API_LOG_LEVEL=${API_LOG_LEVEL:-info}
API_WORKERS=${API_WORKERS:-1}
API_PORT=${API_PORT:-8000}


exec uvicorn "regru.asgi:application" \
  --host "0.0.0.0" \
  --workers "$API_WORKERS" \
  --port "$API_PORT" \
  --log-level "$API_LOG_LEVEL" \
  --timeout-keep-alive "$API_KEEP_ALIVE"
