.PHONY: start-frontend
start-frontend:
	cd packages/frontend && bun run dev

.PHONY: start-backend
start-backend:
	cd packages/backend && bun run dev

.PHONY: start-all
start-all: start-frontend start-backend

.PHONY: docker-up
docker-up: 
	docker compose -f docker-compose.dev.yml up --build

.PHONY: docker-down
docker-down: 
	docker compose -f docker-compose.dev.yml down -v

.PHONY: b-install
b-install:
	cd packages/backend && bun install

.PHONY: f-install
f-install:
	cd packages/frontend && bun install

.PHONY: db-generate
db-generate:
	cd packages/backend && bun run db:generate

.PHONY: db-migrate
db-migrate:
	cd packages/backend && bun run db:migrate

.PHONY: db-seed
db-seed:
	cd packages/backend && bun run db:seed
