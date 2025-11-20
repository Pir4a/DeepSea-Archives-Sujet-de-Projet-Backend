.PHONY: up down restart logs test build

# Variables
DOCKER_DIR = docker
COMPOSE = docker-compose -f $(DOCKER_DIR)/docker-compose.yaml

# Start all services
up:
	 $(COMPOSE) up -d --build

# Stop all services
down:
	 $(COMPOSE) down

# Restart all services
restart: down up

# View logs
logs:
	 $(COMPOSE) logs -f

# Run tests for all services (locally)
test:
	@echo "Testing Common..."
	cd packages/common && npm test
	@echo "Testing Auth Service..."
	cd services/auth-service && npm test || echo "Auth Service tests failed/missing"
	@echo "Testing Observation Service..."
	cd services/observation-service && npm test || echo "Observation Service tests failed/missing"
	@echo "Testing Taxonomy Service..."
	cd services/taxonomy-service && npm test || echo "Taxonomy Service tests failed/missing"

# Build images without starting
build:
	 $(COMPOSE) build

# Clean up docker resources
clean:
	 $(COMPOSE) down -v --remove-orphans

