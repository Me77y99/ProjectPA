FROM node:lts-stretch-slim
WORKDIR /usr/src/Client
COPY . .
RUN npm install typescript
RUN npm install
RUN tsc
CMD ["node", "Client.js"]

