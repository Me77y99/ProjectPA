FROM node:lts-stretch-slim
WORKDIR /usr/src/Websocket/Server
COPY . .
RUN npm install
RUN tsc 
WORKDIR /usr/src/Websocket-compiled/Server
# come lanciare Server e Client su due terminali
CMD ["node", "Server.js"]

   