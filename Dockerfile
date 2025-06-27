# ---- Chef Stage: Installs cargo-chef ----
FROM rust:nightly-slim AS chef
RUN cargo install cargo-chef

# ---- Planner Stage: Creates the dependency recipe ----
FROM chef AS planner
WORKDIR /app
COPY . .
# To ensure a consistent lock file, generate it within the Linux build environment.
RUN rm -f Cargo.lock && cargo generate-lockfile
# Use the dummy binary to generate a recipe for the entire workspace
RUN cargo chef prepare --recipe-path recipe.json --bin chef

# ---- Cooker Stage: Builds dependencies ----
# This is the most important layer for caching.
# It is minimal and only copies the recipe.
FROM chef AS cooker
WORKDIR /app
COPY --from=planner /app/recipe.json recipe.json
# Cook the dependencies based *only* on the recipe.
# This will use the locked versions from the recipe and cache them.
RUN cargo chef cook --release --recipe-path recipe.json

# ---- Builder Stage: Builds the application ----
# Starts from the cooker, which has all dependencies pre-built.
FROM cooker AS builder
WORKDIR /app
# Now copy the entire application source code.
COPY . .
# Build the final binary. This will be fast.
RUN cargo build --release --package src-backend

# ---- Final Stage: Creates the minimal runtime image ----
FROM gcr.io/distroless/cc-debian12
WORKDIR /app
COPY --from=builder /app/target/release/src-backend .
COPY --from=builder /app/dist ./dist
COPY ./src-backend/.env.example ./.env
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000
EXPOSE 8000
CMD ["./src-backend"] 