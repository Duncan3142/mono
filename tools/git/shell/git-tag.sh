#!/usr/bin/env bash

set -euC
set -o pipefail

pkgTag=$1

function return () {
	case $? in
		0) ;;
		64) ;;
		*) exit 1
	esac
}

trap "return" EXIT

timber info "Tagging ${pkgTag}..."

if git-fetch -t "${pkgTag}"; then
	timber warn "Tag ${pkgTag} already exists"
	tagSha=$(git show-ref --hash --tags "${pkgTag}")
	headSha=$(git rev-parse HEAD)
	if [[ "${tagSha}" != "${headSha}" ]]; then
		timber warn "Tag ${pkgTag} (${tagSha}) does not reference ${EVENT_BRANCH} HEAD (${headSha})"
		exit 64
	fi
else
	git tag "${pkgTag}"
	git push "${GIT_REMOTE}" "${pkgTag}"
fi
