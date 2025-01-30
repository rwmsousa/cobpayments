include .env
IMAGE_NAME=$(DOCKER_IMAGE_NAME)

build:
	sudo yarn install && sudo yarn build
	cd frontend && sudo yarn install && sudo yarn build
	docker build -t $(IMAGE_NAME) . --no-cache

up:
	docker-compose up

down:
	docker-compose down

logs:
	docker-compose logs -f app

restart:
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); fi
	docker-compose build
	docker-compose up

start:
	yarn start

start-dev:
	yarn start:dev

start-prod:
	yarn start:prod

migration-generate:
	yarn migration:generate $(name)

migration-run:
	yarn migration:run

migration-revert:
	yarn migration:revert

test:
	yarn test

test-watch:
	yarn test:watch

test-e2e:
	yarn test:e2e

lint:
	yarn lint

format:
	yarn format