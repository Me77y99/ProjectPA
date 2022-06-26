FROM node:lts-stretch-slim
WORKDIR /usr/src/API
COPY . .
RUN npm install
RUN npm run tsc
CMD ["node", "router.js"] 