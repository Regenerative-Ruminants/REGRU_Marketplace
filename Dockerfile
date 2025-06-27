# ---- Chef Stage ----
# Installs cargo-chef.
FROM rust:1.78 AS chef
RUN cargo install cargo-chef

# ---- Planner Stage ----
# Generates the recipe from the full project context using the dummy chef binary.
FROM chef AS planner
WORKDIR /app
COPY . .
RUN cargo chef prepare --recipe-path recipe.json --bin chef

# ---- Cooker Stage ----
# Cooks dependencies. This is the main cache layer and the slowest step.
# It is only re-run when the recipe changes.
FROM chef AS cooker
WORKDIR /app
# Copy the recipe, the key for caching.
COPY --from=planner /app/recipe.json recipe.json

# Copy all manifests and the lock file to give cargo full context.
COPY Cargo.toml Cargo.lock ./
COPY src-backend/Cargo.toml ./src-backend/
COPY crates/autonomi-core/Cargo.toml ./crates/autonomi-core/

# Copy the source code of all local path dependencies.
# This is critical for cargo-chef to understand the workspace.
COPY crates/autonomi-core/src ./crates/autonomi-core/src

# Cook dependencies. This layer is cached if recipe.json is unchanged.
RUN cargo chef cook --release --recipe-path recipe.json

# ---- App Builder Stage ----
# Now, build the actual application binary using the cached dependencies.
FROM cooker AS app_builder
WORKDIR /app
# Copy the application's specific source code.
COPY src-backend/src ./src-backend/src
# Build the binary. This step will now be fast.
RUN cargo build --release --package src-backend

# ---- Final Stage ----
# Create a minimal final image for deployment.
FROM gcr.io/distroless/cc-debian12
WORKDIR /app
COPY --from=app_builder /app/target/release/src-backend .
COPY ./dist ./dist
COPY ./src-backend/.env.example ./.env
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000
EXPOSE 8000
CMD ["./src-backend"] 