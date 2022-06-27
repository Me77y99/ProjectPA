FROM node:lts-stretch-slim
WORKDIR /usr/src/server
COPY . .
RUN npm install -g typescript
RUN npm install
RUN tsc
CMD ["node", "Server.js"]

   
   