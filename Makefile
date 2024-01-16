add:
	git add .

commit: add
	pnpm exec cz

up:
	pnpm up -r

upi: up
	pnpm up -irL
