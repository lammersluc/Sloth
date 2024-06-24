FROM oven/bun as base

FROM base as builder
WORKDIR /app

COPY package.json bun.lockb tsconfig.json .
RUN bun install --frozen-lockfile --production

FROM base as runner
WORKDIR /app

COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/tsconfig.json tsconfig.json
COPY src src

USER bun
ENTRYPOINT ["bun", "run", "src/index.ts"]