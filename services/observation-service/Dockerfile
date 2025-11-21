FROM node:20

WORKDIR /app

# copier le module commun
COPY packages/common ./packages/common

COPY services/observation-service/package*.json ./
COPY services/observation-service/tsconfig.json ./
COPY services/observation-service/prisma ./prisma
COPY services/observation-service/src ./src

RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

EXPOSE 4002

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]