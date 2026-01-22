FROM node:20-slim AS alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN pnpm i -g turbo

WORKDIR /app

FROM alpine AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  build-essential \
  python3 \
  pkg-config \
  openssl \
  && rm -rf /var/lib/apt/lists/*

# Install Cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"

FROM base AS pruner

WORKDIR /app
COPY . .
RUN turbo prune --scope=cardano-graphical-tx --docker

# Build the project
FROM base AS builder

# Ensure Rust/Cargo environment is available
ENV PATH="/root/.cargo/bin:$PATH"
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Define an ARG for the NEXT_PUBLIC_CBOR_ENDPOINT
ARG NEXT_PUBLIC_CBOR_ENDPOINT
# Define an ARG for the NEXT_PUBLIC_GA_TRACKING_ID
ARG NEXT_PUBLIC_GA_TRACKING_ID
# Set the ARG value to ENV so that it's available during build
ENV NEXT_PUBLIC_CBOR_ENDPOINT=${NEXT_PUBLIC_CBOR_ENDPOINT}
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}

# Skip environment variable validation at buildtime
ENV SKIP_VALIDATION=1

RUN pnpm run build --filter=cardano-graphical-tx
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

FROM base AS production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nodejs nodejs && \
    mkdir -p /home/nodejs /app/.cache/corepack && \
    chown -R nodejs:nodejs /home/nodejs /app/.cache

# Set corepack cache to a writable location
ENV COREPACK_HOME=/app/.cache/corepack
ENV HOME=/home/nodejs

USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
# Ensure corepack cache directory exists and is writable
RUN mkdir -p /app/.cache/corepack
WORKDIR /app/apps/web

ENV NODE_ENV=production

CMD ["pnpm", "run", "start"]
