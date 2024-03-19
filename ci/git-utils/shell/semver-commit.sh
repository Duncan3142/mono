#!/usr/bin/env bash

set -euC

CHANGES_JSON=$1

GIT_REMOTE="${GIT_REMOTE:-origin}"

HEAD_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$HEAD_BRANCH" != "${SEMVER_BRANCH}" ]; then
	timber error "HEAD is not on ${SEMVER_BRANCH}"
fi

git add .

pkgName=$(echo -E "${CHANGES_JSON}" | jq '.pkg.name')

if git commit -m "Semver ${pkgName}"; then
	timber debug "Pushing ${SEMVER_BRANCH} to ${GIT_REMOTE}"
	git push --force-with-lease "${GIT_REMOTE}" "${SEMVER_BRANCH}"
	exit 0
fi

exit 1
