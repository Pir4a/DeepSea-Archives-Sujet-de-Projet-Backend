FROM node:20

WORKDIR /app

# copier le module commun
COPY packages/common ./packages/common

COPY services/taxonomy-service/package*.json ./
COPY services/taxonomy-service/tsconfig.json ./
COPY services/taxonomy-service/src ./src

RUN npm install
RUN npm run build

EXPOSE 4002

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]