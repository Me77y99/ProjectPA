FROM node:lts-stretch-slim
WORKDIR /usr/src/Server
COPY . .
RUN npm install
RUN npm run tsc
CMD ["node", "Server.js"]

   