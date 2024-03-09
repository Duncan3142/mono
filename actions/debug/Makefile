build:
	docker build -t debug:latest .

rm:
	docker rm debug || true

it: rm build
	docker run -it --entrypoint /bin/sh --name debug debug:latest

run: rm build
	docker run --name debug debug:latest
