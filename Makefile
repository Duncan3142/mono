add:
	git add .

change: add
	pnpm exec changeset

commit: change
	pnpm exec cz

up:
	pnpm up -r

upi: up
	pnpm up -irL
