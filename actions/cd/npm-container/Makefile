build:
	docker build -t debug:latest .

rm:
	docker rm debug 2> /dev/null || true

it: rm build
	# docker run -it --entrypoint /bin/bash --name debug -v "/run/user/$${UID}/docker.sock:/var/run/docker.sock:rw" debug:latest
	docker run -it --entrypoint /bin/bash --name debug debug:latest

run: rm build
	docker run --name debug debug:latest
