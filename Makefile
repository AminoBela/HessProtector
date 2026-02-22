.PHONY: dev dev-build prod prod-build local stop-dev stop-prod logs-dev logs-prod clean

# --- Development Environment (Hot Reload Docker) ---
dev:
	@echo "🚀 Starting Development Environment (Fast)..."
	docker compose -f docker-compose.yml up

dev-build:
	@echo "📦 Building & Starting Development Environment (Full Rebuild)..."
	docker compose -f docker-compose.yml up --build

stop-dev:
	@echo "🛑 Stopping Development Environment..."
	docker compose -f docker-compose.yml down

# --- Ultra-Fast Native Local Environment ---
local:
	@echo "⚡ Starting Native Local Dev (Frontend & Backend without Docker)..."
	@echo "Make sure you have Node and Python installed natively."
	@trap 'kill 0' SIGINT; \
	cd backend && uvicorn main:app --reload --port 8000 & \
	cd frontend && npm run dev

# --- Production Environment (Optimized & Detached) ---
prod:
	@echo "🚀 Starting Production Environment (Fast)..."
	docker compose -f docker-compose.prod.yml up -d
	@echo "✅ Production is running!"

prod-build:
	@echo "📦 Deploying Production Environment (Full Rebuild)..."
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
