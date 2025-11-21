FROM node:20 AS base

WORKDIR /app

# Build the shared common package
COPY packages/common ./packages/common
RUN cd packages/common && npm install && npm run build

# --- AUTH SERVICE SOURCES ---
COPY services/auth-service/package*.json ./auth/
COPY services/auth-service/tsconfig.json ./auth/
COPY services/auth-service/src/swagger ./auth/swagger
COPY services/auth-service/src/prisma ./auth/prisma
COPY services/auth-service/src ./auth/src

# --- INSTALL + BUILD ---
WORKDIR /app/auth
RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# --- UNIFY ALL BUILD OUTPUT INTO /app/dist ---
RUN mkdir -p /app/dist
RUN cp -r /app/auth/dist/* /app/dist/

# ----------------------------------------
# PRODUCTION IMAGE
# ----------------------------------------
FROM node:20

WORKDIR /app

ENV NODE_ENV=production

# Copy the fully built dist + common + node_modules
COPY --from=base /app/auth/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/packages ./packages
COPY --from=base /app/auth/swagger ./dist/swagger
COPY --from=base /app/auth/prisma ./dist/prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./dist/prisma/schema.prisma && node dist/server.js"]