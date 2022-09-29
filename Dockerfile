FROM node:16-alpine as base
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8090
CMD ["yarn", "start:prod"]
