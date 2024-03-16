#!/usr/bin/env bash

set -euC

CHANGES_JSON=$1

HEAD_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$HEAD_BRANCH" != "${SEMVER_BRANCH}" ]; then
	timber error "HEAD is not on ${SEMVER_BRANCH}"
fi

git add .

PKG_NAME=$(echo -E "${CHANGES_JSON}" | jq '.name')

if git commit -m "Semver ${PKG_NAME}"; then
	timber debug "Pushing ${SEMVER_BRANCH} to ${REMOTE}"
	git push --force-with-lease "${REMOTE}" "${SEMVER_BRANCH}"
	exit 0
fi

exit 1
