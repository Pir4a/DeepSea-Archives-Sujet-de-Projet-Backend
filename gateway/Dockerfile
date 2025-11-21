FROM node:20 AS base

WORKDIR /app

# --- COMMON PACKAGE ---
COPY packages/common ./packages/common
RUN cd packages/common && npm install && npm run build

# --- GATEWAY PACKAGE ---
COPY gateway/package*.json ./gateway/
COPY gateway/tsconfig.json ./gateway/
COPY gateway/src ./gateway/src

WORKDIR /app/gateway
RUN npm install
RUN npm run build

RUN mkdir -p /app/dist
RUN cp -r /app/gateway/dist/* /app/dist/

# --- PRODUCTION IMAGE ---
FROM node:20 AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/gateway/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/packages ./packages

EXPOSE 4000

CMD ["node", "dist/server.js"]