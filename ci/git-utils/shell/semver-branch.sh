#!/usr/bin/env bash

set -euC

function git_branches () {
	git --no-pager branch -a -v -v
}

if timber -l debug; then
	timber debug "Local refs before"
	git_branches
fi

# Try to fetch remote semver branch
if git checkout "${SEMVER_BRANCH}"; then
	if timber -l debug; then
		timber debug "Resetting ${SEMVER_BRANCH} to ${BASE_BRANCH}"
	fi
	git reset --hard "${BASE_BRANCH}"
else
	# Check if the HEAD is at the base branch
	headSha=$(git rev-parse HEAD)
	baseSha=$(git rev-parse "${BASE_BRANCH}")

	if [[ "${headSha}" != "${baseSha}" ]]; then
		timber error "HEAD is not at ${BASE_BRANCH}"
		timber debug "HEAD: ${headSha}"
		timber debug "${BASE_BRANCH}: ${baseSha}"
		exit 1
	fi

	# Create semver branch from base
	timber debug "Creating ${SEMVER_BRANCH} from ${BASE_BRANCH}"
	git checkout --progress -b "${SEMVER_BRANCH}"
fi
