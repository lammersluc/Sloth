FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json /app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install --only=production && npm cache clean --force

FROM node:lts-alpine as runner

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY /src /app/src

CMD ["node", "src/index.js"]