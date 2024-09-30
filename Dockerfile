# Building phase
# Change it so that it uses node 18
FROM node:18-alpine as builder
WORKDIR /app
# Install cargo deps
RUN apk add python3 curl gcc make musl-dev build-base cairo-dev libjpeg-turbo-dev pango-dev giflib-dev
# Install cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
# Add cargo to path
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy repo
COPY . .

# build and installs deps
RUN yarn build:pallas
RUN echo node --version
RUN yarn install --immutable
RUN yarn build

# Runner image
FROM node:18-alpine
WORKDIR /app


# Copy from builder image
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public


EXPOSE 3000
CMD ["yarn", "start"]

