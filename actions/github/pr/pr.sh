#!/usr/bin/env bash

CHANGES=false

git add .

HEAD_REF=$(git rev-parse --abbrev-ref HEAD)

if git commit -m "Semver \"${PKG_NAME}\""; then
	CHANGES=true
	git push --force-with-lease "${REMOTE}" "${HEAD_REF}"
fi

if ! URL=$(gh pr create --base "${BASE_BRANCH}" --title "SemVer \"${PKG_NAME}\"" --body "This is an auto generated PR to semantically version \"${PKG_NAME}\"" --label ci --label semver); then
	URL=$(gh pr list --base "${BASE_BRANCH}" --head "${HEAD_REF}" --label ci --label semver --json url --jq '.[0].url')
	if [ -z "${URL}" ]; then
		echo "Failed to find existing PR"
		exit 1
	fi
fi

# gh pr merge --auto --squash

export CHANGES URL
