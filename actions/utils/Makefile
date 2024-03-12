SHELL := /usr/bin/bash

build:
	docker build -t github-utils:latest .

rm:
	docker rm github-utils 2> /dev/null || true

it: rm build
	docker run -it --env-file .env --entrypoint /bin/bash --name github-utils github-utils:latest

run: rm build
	docker run --env-file .env --name github-utils github-utils:latest
