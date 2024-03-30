#!/usr/bin/env bash

set -euC
set -o pipefail

function return () {
	case $? in
		0) ;;
		64) ;;
		*) exit 1
	esac
}

trap "return" EXIT

pkgName=$1

timber info "Committing SemVer changes..."

headBranch=$(git rev-parse --abbrev-ref HEAD)
if [ "$headBranch" != "${SEMVER_BRANCH}" ]; then
	timber error "HEAD is not on ${SEMVER_BRANCH}"
	exit 1
fi

git add .

if git commit -m "Semver ${pkgName}"; then
	timber debug "Pushing ${SEMVER_BRANCH} to ${GIT_REMOTE}"
	git push --force-with-lease "${GIT_REMOTE}" "${SEMVER_BRANCH}"
else
	exit 64
fi
