#!/usr/bin/env bash

set -euC

pkgTag=$1

if git tag "${pkgTag}"; then
	git push "${GIT_REMOTE}" "${pkgTag}"
else
	timber warn "Tag ${pkgTag} already exists"
	tagSha=$(git show-ref --tags "/refs/tags/${pkgTag}")
	if [[ "${tagSha}" != "$(git rev-parse HEAD)" ]]; then
		timber error "Tag ${pkgTag} does not reference ${BASE_BRANCH} HEAD"
		exit 1
	fi
fi
