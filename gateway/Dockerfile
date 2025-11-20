FROM node:20 AS base

WORKDIR /app

# --- COMMON PACKAGE ---
COPY packages/common ./packages/common

# Installer deps du common et builder
RUN cd packages/common && npm install && npm run build

# --- GATEWAY PACKAGE ---
COPY gateway/package*.json ./gateway/
COPY gateway/tsconfig.json ./gateway/
COPY gateway/src ./gateway/src

WORKDIR /app/gateway
RUN npm install
RUN npm run build

# --- PRODUCTION IMAGE ---
FROM node:20 AS production
WORKDIR /app
ENV NODE_ENV=production

# Copier common construit
COPY --from=base /app/packages/common ./packages/common

# Copier gateway construit
COPY --from=base /app/gateway ./gateway

WORKDIR /app/gateway

EXPOSE 4000

CMD ["node", "dist/server.js"]