FROM node:20 AS base

WORKDIR /app

# Copier le package commun
COPY packages/common ./packages/common

# Copier le service
COPY services/taxonomy-service/package*.json services/taxonomy-service/tsconfig.json ./services/taxonomy-service/
COPY services/taxonomy-service/src ./services/taxonomy-service/src

WORKDIR /app/services/taxonomy-service
RUN npm install
RUN npm run build

FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/services/taxonomy-service ./services/taxonomy-service
COPY --from=base /app/packages/common ./packages/common

WORKDIR /app/services/taxonomy-service

EXPOSE 4003

CMD ["node", "dist/server.js"]

