FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
