SHELL := /usr/bin/bash

stop:
	docker stop -t 2 github-utils || true

rm: stop
	docker rm github-utils || true

build: rm
	docker build -t github-utils:latest .

it: build
	docker run -it --env-file .env --entrypoint /bin/bash --name github-utils github-utils:latest

run: build
	docker run --env-file .env --name github-utils github-utils:latest
