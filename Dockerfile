FROM node:18-slim as build
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .
RUN npx prisma generate
RUN yarn build

CMD ["node", "dist/main.js"]