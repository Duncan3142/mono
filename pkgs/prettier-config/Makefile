change:
	npm exec -- changeset

add:
	git add .

stage: change add

commit: stage
	git commit

version:
	npm exec -- changeset version > /dev/null 2>&1

install:
	npm ci

up:
	npm up

# upi: up
# 	npm up -iL
