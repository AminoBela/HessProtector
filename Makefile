SHELL := /bin/bash

.PHONY: local

local:
	@echo "Starting HessProtector (Backend + Frontend)..."
	@trap 'kill 0' SIGINT; \
	cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000 & \
	cd frontend && npm run dev

