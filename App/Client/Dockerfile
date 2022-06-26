FROM node:lts-stretch-slim
WORKDIR /usr/src/WebsocketClient
COPY . .
RUN npm install
RUN tsc 
CMD ["node", "Client.js"]

