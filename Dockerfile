FROM node:18-slim as build
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN apt-get update -y && apt-get install -y openssl
COPY . .
RUN npx prisma generate
RUN yarn build

CMD ["node", "dist/main.js"]