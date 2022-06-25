FROM node:lts-stretch-slim
WORKDIR /usr/src/Websocket/Client
COPY . .
RUN npm install
RUN tsc 
WORKDIR /usr/src/Websocket-compiled/Client
# come lanciare Server e Client su due terminali
CMD ["node", "Client.js"]

