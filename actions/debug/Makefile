build:
	docker build -t debug:latest .

rm:
	docker rm debug 2> /dev/null || true

it: rm build
	docker run -it --entrypoint /bin/sh --name debug debug:latest

run: rm build
	docker run --name debug debug:latest
