#!/usr/bin/env bash

set -euC

CHANGES_JSON=$1

git add .

PKG_NAME=$(echo -E "${CHANGES_JSON}" | jq '.name')

if git commit -m "Semver ${PKG_NAME}"; then
	timber debug "Pushing ${SEMVER_BRANCH} to ${REMOTE}"
	git push --force-with-lease "${REMOTE}" "${SEMVER_BRANCH}"
	exit 0
fi

exit 1
