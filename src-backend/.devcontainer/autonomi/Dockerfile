# Use an official Rust image as the base
FROM rust:latest

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required by Anvil (e.g., for OpenSSL)
# These are common dependencies for many Rust projects that involve networking or cryptography.
RUN apt-get update && \
    apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    clang \
    git \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install rustfmt, a code formatter for Rust
RUN rustup component add rustfmt

# Install Foundryup, which includes Anvil
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH="/root/.foundry/bin:${PATH}"
RUN foundryup

# Clone the autonomi repository
RUN git clone https://github.com/maidsafe/autonomi

# Change into the cloned directory
WORKDIR /app/autonomi

RUN cargo build --bin evm-testnet
RUN cargo build --bin antctl
