FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY /src /app/src

# Start me!
CMD ["node", "src/index.js"]