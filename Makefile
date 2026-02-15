
.PHONY: dev prod build-dev build-prod stop logs-dev logs-prod

# --- Development Environment (Hot Reload) ---
dev:
	@echo "🚀 Starting Development Environment..."
	docker compose -f docker-compose.yml up --build

stop-dev:
	@echo "🛑 Stopping Development Environment..."
	docker compose -f docker-compose.yml down

# --- Production Environment (Optimized & Detached) ---
prod:
	@echo "🚀 Deploying Production Environment..."
	docker compose -f docker-compose.prod.yml up -d --build
	@echo "✅ Production is running!"

stop-prod:
	@echo "🛑 Stopping Production Environment..."
	docker compose -f docker-compose.prod.yml down

# --- Utilities ---
logs-dev:
	docker compose -f docker-compose.yml logs -f

logs-prod:
	docker compose -f docker-compose.prod.yml logs -f

clean:
	docker system prune -f
