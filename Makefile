COMPOSE = docker compose

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f

build:
	$(COMPOSE) build

buildup:
	$(COMPOSE) build && $(COMPOSE) up -d

clean:
	$(COMPOSE) down -v --remove-orphans
test: test-common test-auth test-observation test-taxonomy

test-common:
	cd ./packages/common && npm install && npm run build && npm link && npm run test

test-auth:
	cd ./services/auth-service && npm install && npm link @deepsea/common && npx prisma generate --schema=src/prisma/schema.prisma && npm run build && npm run test

test-observation:
	cd ./services/observation-service && npm install && npm link @deepsea/common && npx prisma generate && npm run build && npm run test

test-taxonomy:
	cd ./services/taxonomy-service && npm install && npm link @deepsea/common && npm run build && npm run test
