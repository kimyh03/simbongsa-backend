FROM node:12.18.3-alpine AS builder
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM node:12.18.3-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

CMD ["npm", "run", "start:prod"]