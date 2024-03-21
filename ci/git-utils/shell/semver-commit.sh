#!/usr/bin/env bash

set -euC

pkgName=$1

headBranch=$(git rev-parse --abbrev-ref HEAD)
if [ "$headBranch" != "${SEMVER_BRANCH}" ]; then
	timber error "HEAD is not on ${SEMVER_BRANCH}"
fi

git add .

if git commit -m "Semver ${pkgName}"; then
	timber debug "Pushing ${SEMVER_BRANCH} to ${GIT_REMOTE}"
	git push --force-with-lease "${GIT_REMOTE}" "${SEMVER_BRANCH}"
	exit 0
fi

exit 1
