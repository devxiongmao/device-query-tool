
.PHONY: install
install:
	gem install bundler
	bundle install

.PHONY: dev
dev:
	rails server -p 3001

.PHONY: docker-build
docker-build:
	docker-compose build --no-cache

.PHONY: docker-dev
docker-dev:
	docker volume create device_query_db_volume
	docker-compose up --build

