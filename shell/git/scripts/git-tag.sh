#!/usr/bin/env bash

set -euC
set -o pipefail

pkgTag=$1

timber info "Tagging ${pkgTag}..."

if git-fetch -t "${pkgTag}"; then
	timber warn "Tag ${pkgTag} already exists"
	tagSha=$(git show-ref --hash --tags "${pkgTag}")
	headSha=$(git rev-parse HEAD)
	if [[ "${tagSha}" != "${headSha}" ]]; then
		timber warn "Tag ${pkgTag} (${tagSha}) does not reference ${EVENT_BRANCH} HEAD (${headSha})"
		exit 8
	fi
else
	git tag "${pkgTag}" || exit 1
	git push "${GIT_REMOTE}" "${pkgTag}" || exit 1
fi
