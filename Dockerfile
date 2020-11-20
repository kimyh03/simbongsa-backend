FROM node:13 AS builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:dev"]