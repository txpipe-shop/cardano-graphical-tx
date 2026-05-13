FROM node:22-slim AS alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN mkdir -p /pnpm
RUN pnpm config set global-bin-dir /pnpm
RUN pnpm i -g turbo
WORKDIR /app

FROM alpine AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  build-essential \
  python3 \
  pkg-config \
  libssl-dev \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"

FROM alpine AS pruner

WORKDIR /app
COPY . .
RUN turbo prune --scope=cardano-graphical-tx --docker

FROM base AS builder

ENV PATH="/root/.cargo/bin:$PATH"
ENV CARGO_HOME="/root/.cargo"
ENV RUSTUP_HOME="/root/.rustup"

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

COPY --from=pruner /app/out/full/ .

ARG NEXT_PUBLIC_CBOR_ENDPOINT
ARG NEXT_PUBLIC_GA_TRACKING_ID
ENV NEXT_PUBLIC_CBOR_ENDPOINT=${NEXT_PUBLIC_CBOR_ENDPOINT}
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}
ENV SKIP_VALIDATION=1

RUN pnpm run build --filter=cardano-graphical-tx
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

FROM node:22-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
  libjpeg62-turbo libgif7 librsvg2-2 \
  && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nodejs nodejs && \
    mkdir -p /home/nodejs && \
    chown -R nodejs:nodejs /home/nodejs

COPY --from=builder --chown=nodejs:nodejs /app /app

USER nodejs
WORKDIR /app/apps/web

ENV NODE_ENV=production

CMD ["npx", "next", "start"]
