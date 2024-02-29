change:
	pnpm exec changeset

add:
	git add .

stage: change add

commit: stage
	git commit

up:
	pnpm up -r

upi: up
	pnpm up -irL
