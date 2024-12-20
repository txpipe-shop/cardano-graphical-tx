# Building phase
# Change it so that it uses node 18
FROM node:18-bullseye as builder
WORKDIR /app
# Install cargo deps
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  curl \
  gcc \
  make \
  libc6-dev \
  build-essential \
  libcairo2-dev \
  libjpeg62-turbo-dev \
  libpango1.0-dev \
  libgif-dev

# Install cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
# Add cargo to path
ENV PATH "/root/.cargo/bin:${PATH}"

# Skip environment variable validation at buildtime
ENV SKIP_VALIDATION true

# Define an ARG for the NEXT_PUBLIC_CBOR_ENDPOINT
ARG NEXT_PUBLIC_CBOR_ENDPOINT

# Set the ARG value to ENV so that it's available during build
ENV NEXT_PUBLIC_CBOR_ENDPOINT=${NEXT_PUBLIC_CBOR_ENDPOINT}

# Copy repo
COPY . .


# build and installs deps
RUN yarn build:pallas
RUN echo node --version
RUN yarn install --immutable
RUN yarn build

# Runner image
FROM node:18-bullseye
WORKDIR /app

# Copy from builder image
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/docs/schema.json ./docs/schema.json


EXPOSE 3000
CMD ["yarn", "start"]