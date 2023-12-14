FROM oven/bun

WORKDIR /app

COPY src ./src
COPY package.json .

ARG DISCORD_TOKEN
ARG CLIENT_ID
ARG DEVS
ARG TICKET_GUILD
ARG TICKET_CATEGORY

RUN bun install

CMD ["bun", "start"]
