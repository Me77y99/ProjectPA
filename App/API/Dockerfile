FROM node:lts-stretch-slim
WORKDIR /usr/src
COPY ./package.json .
RUN npm install
WORKDIR /usr/src/Api
COPY . .
RUN tsc 
WORKDIR /usr/src/Api-compiled
CMD ["node", "router.js"] 
