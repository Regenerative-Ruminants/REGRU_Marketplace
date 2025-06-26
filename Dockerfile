# ---- Chef Stage ----
# This stage installs cargo-chef, our tool for caching dependencies.
FROM rust:1.78 AS chef
RUN cargo install cargo-chef

# ---- Planner Stage ----
# This stage calculates the dependency plan (the "recipe").
# It only re-runs when Cargo.toml or Cargo.lock files change.
FROM chef AS planner
WORKDIR /usr/src/app
COPY . .
# We must explicitly tell cargo-chef which binary's recipe to prepare in a workspace.
RUN cargo chef prepare --recipe-path recipe.json --bin src-backend

# ---- Builder Stage ----
# This stage builds the dependencies using the cached recipe.
# This is the slowest step and will be cached most of the time.
FROM chef AS builder
WORKDIR /usr/src/app
# Copy the recipe from the planner stage.
COPY --from=planner /usr/src/app/recipe.json recipe.json

# To properly cook dependencies for a workspace, we also need all the Cargo.toml files
# and the lock file to give cargo-chef the full context.
COPY Cargo.toml Cargo.lock ./
COPY crates/autonomi-core/Cargo.toml ./crates/autonomi-core/
COPY src-backend/Cargo.toml ./src-backend/

# Cook (build) the dependencies. This is the heavy lifting.
# As long as recipe.json doesn't change, this layer is cached.
RUN cargo chef cook --release --recipe-path recipe.json

# Now, copy the application source code and build it.
# This is fast because dependencies are already compiled.
COPY . .
# We must still specify the package to build.
RUN cargo build --release --package src-backend

# ---- Final Stage ----
# Create a slim, final image with only the compiled binary and static assets.
FROM gcr.io/distroless/cc-debian12
WORKDIR /app

# Copy the compiled backend executable from the builder stage.
# The executable path for a workspace build is slightly different.
COPY --from=builder /usr/src/app/target/release/src-backend .

# Copy the static frontend assets.
COPY ./dist ./dist

# Copy the .env.example file.
COPY ./src-backend/.env.example ./.env

ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000
EXPOSE 8000

CMD ["./src-backend"] 