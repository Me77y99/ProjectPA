FROM node:lts-stretch-slim
WORKDIR /usr/src/API
COPY . .
RUN npm install
RUN tsc
CMD ["node", "router.js"] 