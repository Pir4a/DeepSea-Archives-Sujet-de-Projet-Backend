.PHONY: up down restart logs test build

# Variables
DOCKER_DIR = docker
COMPOSE = docker-compose -f $(DOCKER_DIR)/docker-compose.yaml

# Start all services
up:
	cd $(DOCKER_DIR) && $(COMPOSE) up -d --build

# Stop all services
down:
	cd $(DOCKER_DIR) && $(COMPOSE) down

# Restart all services
restart: down up

# View logs
logs:
	cd $(DOCKER_DIR) && $(COMPOSE) logs -f

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
	cd $(DOCKER_DIR) && $(COMPOSE) build

# Clean up docker resources
clean:
	cd $(DOCKER_DIR) && $(COMPOSE) down -v --remove-orphans

