FROM node:lts-stretch-slim
WORKDIR /usr/src/api
COPY . .
RUN npm install -g typescript
RUN npm install
RUN tsc
CMD ["node", "router.js"]
