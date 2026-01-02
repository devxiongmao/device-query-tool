.PHONY: f-start
f-start:
	cd packages/frontend && bun run dev

.PHONY: b-start
b-start:
	cd packages/backend && bun run dev

.PHONY: start-all
start-all: start-frontend start-backend

.PHONY: docker-up
docker-up: 
	docker compose -f docker-compose.dev.yml up --build

.PHONY: docker-down
docker-down: 
	docker compose -f docker-compose.dev.yml down -v

.PHONY: docker-logs
docker-logs:
	docker compose -f docker-compose.dev.yml logs

.PHONY: docker-restart
docker-restart:
	docker compose -f docker-compose.dev.yml restart

.PHONY: docker-clean
docker-clean:
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

.PHONY: b-lint
b-lint:
	cd packages/backend && bun run lint

.PHONY: b-lint-fix
b-lint-fix:
	cd packages/backend && bun run lint:fix

.PHONY: b-types
b-types:
	cd packages/backend && bun run typecheck

.PHONY: b-test
b-test:
	cd packages/backend && bun run test

.PHONY: f-lint
f-lint:
	cd packages/frontend && bun run lint

.PHONY: f-lint-fix
f-lint-fix:
	cd packages/frontend && bun run lint:fix

.PHONY: f-types
f-types:
	cd packages/frontend && bun run typecheck

.PHONY: f-test
f-test:
	cd packages/frontend && bun run test

.PHONY: graphql-codegen
graphql-codegen:
	cd packages/frontend && bun run codegen

.PHONY: graphql-codegen-watch
graphql-codegen-watch:
	cd packages/frontend && bun run codegen:watch