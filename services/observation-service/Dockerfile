FROM node:20-alpine AS base

WORKDIR /app

# Installer les dépendances
COPY package*.json tsconfig.json ./
COPY prisma ./prisma

# On ignore le package-lock pour éviter les bugs npm dans le container
RUN rm -f package-lock.json && npm install
RUN npx prisma generate

# Copier le code source et builder le projet TypeScript
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copier les dépendances et le code compilé
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

EXPOSE 4002

CMD ["node", "dist/server.js"]


