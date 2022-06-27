FROM node:lts-stretch-slim
WORKDIR /usr/src/Client
COPY . .
RUN npm install -g typescript
RUN npm install
RUN tsc
CMD ["node", "Clients.js"]

