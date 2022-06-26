FROM node:lts-stretch-slim
WORKDIR /usr/src/Client
COPY . .
RUN npm install
RUN npm run tsc
CMD ["node", "Client.js"]

