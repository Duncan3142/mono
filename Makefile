change:
	pnpm exec changeset

add:
	git add .

stage: change add

up:
	pnpm up -r

upi: up
	pnpm up -irL
