FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["node", "build"]
