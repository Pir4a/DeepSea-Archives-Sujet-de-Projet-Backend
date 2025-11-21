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
