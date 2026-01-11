.PHONY: dev down build logs

dev:
	docker compose up

down:
	docker compose down

build:
	docker compose up --build

logs:
	docker compose logs -f
