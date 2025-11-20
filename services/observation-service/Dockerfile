FROM node:20 AS base

# On travaille à la racine du monorepo dans l'image
WORKDIR /app

# Copier le package commun et le service d'observation
COPY packages/common ./packages/common
COPY services/observation-service/package*.json services/observation-service/tsconfig.json ./services/observation-service/
COPY services/observation-service/prisma ./services/observation-service/prisma
COPY services/observation-service/src ./services/observation-service/src
# Scripts utilitaires (ex: génération de token ADMIN pour Swagger)
COPY services/observation-service/scripts ./services/observation-service/scripts

# Installer les dépendances du service (incluant @deepsea/common en file:../../packages/common)
WORKDIR /app/services/observation-service
RUN npm install
RUN npx prisma generate

# Builder le projet TypeScript
RUN npm run build

FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

# Copier le service compilé et le package commun (pour les dépendances file:)
COPY --from=base /app/services/observation-service ./services/observation-service
COPY --from=base /app/packages/common ./packages/common

WORKDIR /app/services/observation-service

EXPOSE 4002

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
