# Development

This project uses a dev container to create a consistent development environment.

### Docker stack
- app (Dev container)
- db (Postgresql)
- autonomi (EVM Testnet & Autonomi)

The dev container comes with the Autonomi CLI installed, and is pre-configured to use the local testnet and test wallet with all the money.

```bash
ant wallet balance
```

### Host dev requirements
- uv
- docker
- just

### Quick Start

`just` is the project command runner.

The default command will list all available commands:

```bash
just


```

- Use IDE to start the project dev container
- Connect to the dev container via IDE integrated terminal.
- Run: `uv sync`

### Migrate Database
- `cd regru-api`
- `uv run manage.py makemigrations`
- `uv run manage.py migrate`

### Run Development Server
- `cd regru-api`
- `uv run manage.py runserver`

---

# Testing

### Unit Tests

### Integration Tests

### Formatting & Linting

---

# Configuration

Pydantic settings - see `AppConfiguration`

---

# Application Tech Stack

- Django ASGI application (uvicorn server)
- Postgresql
- Autonomi

---

# Build

Build production image:

`./build.sh`

