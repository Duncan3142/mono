change:
	npm exec -- changeset

add:
	git add .

stage: change add

commit: stage
	git commit

update:
	volta pin node@lts
	volta pin npm@11
	npm up
	npm outdated
