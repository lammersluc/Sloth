FROM node:lts-alpine as builder
WORKDIR /build

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
COPY package.json .
RUN npm install --production

FROM oven/bun as runner
WORKDIR /app

COPY --from=builder /build/package.json package.json
COPY --from=builder /build/node_modules node_modules
COPY src src
RUN bun install --frozen-lockfile --production

USER bun
ENTRYPOINT ["bun", "start"]