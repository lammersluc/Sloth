FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg
RUN npm install

COPY /src /app/src

CMD ["node", "src/index.js"]