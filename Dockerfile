FROM oven/bun as base

FROM base as builder
WORKDIR /build

COPY package.json bun.lockb tsconfig.json .
RUN bun install --frozen-lockfile --production

FROM base as runner
WORKDIR /app

COPY --from=builder /build/package.json package.json
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/tsconfig.json tsconfig.json
COPY src src

USER bun
ENTRYPOINT ["bun", "run", "src/index.ts"]