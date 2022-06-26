FROM node:lts-stretch-slim
WORKDIR /usr/src/WebsocketServer
COPY . .
RUN npm install
RUN tsc 
CMD ["node", "Server.js"]

   