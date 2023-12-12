FROM node:20-alpine as development

ENV NODE_ENV development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

CMD ["sh", "-c", "yarn start:dev"]
