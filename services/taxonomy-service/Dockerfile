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

CMD ["node", "dist/server.js"]
