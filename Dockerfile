FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && \
    corepack prepare pnpm@9.15.0 --activate && \
    mkdir -p /pnpm && \
    pnpm config set global-bin-dir /pnpm && \
    pnpm add -g turbo

WORKDIR /app

FROM base AS pruner

WORKDIR /app
COPY . .
RUN turbo prune --scope=cardano-graphical-tx --docker

FROM base AS binary-injector

# The napi-pallas binary is pre-built in CI and injected into the build context.
# Turbo prune does not preserve .node files, so copy it explicitly here.
RUN --mount=type=bind,source=.,target=/context \
    mkdir -p /tmp/napi-pallas && \
    if [ -n "$(ls /context/packages/napi-pallas/*.node 2>/dev/null)" ]; then \
      cp /context/packages/napi-pallas/*.node /tmp/napi-pallas/; \
    else \
      touch /tmp/napi-pallas/.no-binary; \
    fi

FROM base AS deps

RUN --mount=type=cache,id=apt,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    build-essential \
    python3 \
    pkg-config \
    libssl-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain stable
ENV PATH="/root/.cargo/bin:$PATH"
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=cache,id=cargo-registry,target=/root/.cargo/registry \
    --mount=type=cache,id=cargo-git,target=/root/.cargo/git \
    pnpm install --frozen-lockfile

FROM deps AS builder

ARG NEXT_PUBLIC_CBOR_ENDPOINT
ARG NEXT_PUBLIC_GA_TRACKING_ID
ENV NEXT_PUBLIC_CBOR_ENDPOINT=${NEXT_PUBLIC_CBOR_ENDPOINT}
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}
ENV SKIP_VALIDATION=1

WORKDIR /app

COPY --from=pruner /app/out/full/ .
COPY --from=binary-injector /tmp/napi-pallas/ ./packages/napi-pallas/

# If a pre-built napi-pallas binary was injected into the build context it is
# already present under packages/napi-pallas/. Otherwise compile it now.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=cache,id=cargo-registry,target=/root/.cargo/registry \
    --mount=type=cache,id=cargo-git,target=/root/.cargo/git \
    --mount=type=cache,id=cargo-target,target=/app/packages/napi-pallas/target \
    if [ -z "$(ls ./packages/napi-pallas/*.node 2>/dev/null)" ]; then \
      pnpm --filter @laceanatomy/napi-pallas build; \
    fi

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm run build --filter=cardano-graphical-tx

FROM node:22-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --home /home/nodejs nodejs && \
    mkdir -p /home/nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nodejs:nodejs /app/packages/napi-pallas/*.node ./packages/napi-pallas/

USER nodejs

ENV NODE_ENV=production

CMD ["node", "apps/web/server.js"]
