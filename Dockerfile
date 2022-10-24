FROM node:16-alpine as build-stage

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . .

RUN yarn build

# Production stage
FROM node:16-alpine as production-stage

RUN yarn global add pm2

WORKDIR /app

# copy from build image
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/.env.production ./.env.production
COPY --from=build-stage /app/ecosystem.config.js ./ecosystem.config.js

ENV NODE_EMV production

EXPOSE 8090

CMD ["pm2-runtime", "start", "ecosystem.config.js","--only", "pumpkin-api-prod", "--env", "production"]

#CMD ["node", "/app/dist/main.js"]

# Staging stage
FROM node:16-alpine as staging_stage

RUN yarn global add pm2

WORKDIR /app

# copy from build image
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/.env.staging ./.env.staging
COPY --from=build-stage /app/ecosystem.config.js ./ecosystem.config.js

ENV NODE_EMV staging

EXPOSE 8091

CMD ["pm2-runtime", "start", "ecosystem.config.js","--only", "pumpkin-api-staging", "--env", "staging"]
