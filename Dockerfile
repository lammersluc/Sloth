FROM oven/bun as base
WORKDIR /app

FROM base AS builder
COPY package.json bun.lockb .
RUN bun install --frozen-lockfile --production

FROM base AS release
COPY --from=builder node_modules node_modules
COPY src .

ENTRYPOINT [ "bun", "start" ]