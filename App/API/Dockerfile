FROM node:lts-stretch-slim
WORKDIR /usr/src/client
COPY . .
RUN npm install -g typescript
RUN npm install
RUN tsc
CMD ["node", "Client.js"]
