FROM node:20 AS base

WORKDIR /app

# Copy common package
COPY packages/common ./packages/common

# Copy auth service
COPY services/auth-service/package*.json ./services/auth-service/
COPY services/auth-service/tsconfig.json ./services/auth-service/
COPY services/auth-service/src ./services/auth-service/src

WORKDIR /app/services/auth-service
RUN npm install

# Generate Prisma client
# Note: schema is in src/prisma/schema.prisma based on file exploration
RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npm run build

# Copy static assets that aren't compiled by tsc (like swagger yaml)
COPY services/auth-service/src/swagger ./dist/swagger

FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/services/auth-service ./services/auth-service
COPY --from=base /app/packages/common ./packages/common

WORKDIR /app/services/auth-service

EXPOSE 3001

CMD ["node", "dist/server.js"]

