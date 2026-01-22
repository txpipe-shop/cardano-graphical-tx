FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS build-deps

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

# Define an ARG for the NEXT_PUBLIC_CBOR_ENDPOINT
ARG NEXT_PUBLIC_CBOR_ENDPOINT
# Define an ARG for the NEXT_PUBLIC_GA_TRACKING_ID
ARG NEXT_PUBLIC_GA_TRACKING_ID

# Set the ARG value to ENV so that it's available during build
ENV NEXT_PUBLIC_CBOR_ENDPOINT=${NEXT_PUBLIC_CBOR_ENDPOINT}
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}

# Skip environment variable validation at buildtime
ENV SKIP_VALIDATION=1

COPY . .

RUN pnpm install
RUN pnpm run build
# --mount=type=cache,target=/root/.cargo/registry \
# --mount=type=cache,target=/root/.cargo/git \
# --mount=type=cache,target=/app/target \

FROM base AS production

# Copy workspace structure and built artifacts
COPY --from=build-deps /app/package.json ./package.json
COPY --from=build-deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build-deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build-deps /app/apps ./apps
COPY --from=build-deps /app/packages ./packages

EXPOSE 3000

ENV NODE_ENV=production

# Run from workspace root - pnpm filter needs to be executed from here
CMD ["pnpm", "--filter", "cardano-graphical-tx", "start"]
