FROM node:20 AS base

WORKDIR /app

# Copy common package
COPY packages/common ./packages/common

# Copy gateway
COPY gateway/package*.json ./gateway/
COPY gateway/tsconfig.json ./gateway/
COPY gateway/src ./gateway/src

WORKDIR /app/gateway
RUN npm install
RUN npm run build

FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/gateway ./gateway
COPY --from=base /app/packages/common ./packages/common

WORKDIR /app/gateway

EXPOSE 4000

CMD ["node", "dist/server.js"]

