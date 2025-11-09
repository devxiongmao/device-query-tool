.PHONY: start-frontend
start-frontend:
	cd packages/frontend && bun dev

.PHONY: start-backend
start-backend:
	cd packages/backend && bun dev

.PHONY: start-all
start-all: start-frontend start-backend
