add:
	git add .

change:
	pnpm exec changeset

commit: change add
	pnpm exec cz

up:
	pnpm up -r

upi: up
	pnpm up -irL
