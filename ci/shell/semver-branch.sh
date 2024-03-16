#!/usr/bin/env bash

set -euC

function git_branches () {
	git --no-pager branch -a -v -v
}

GIT_REMOTE="${GIT_REMOTE:-origin}"

# Try to fetch remote semver branch
if git fetch "${GIT_REMOTE}" --depth=1 "refs/heads/${SEMVER_BRANCH}:refs/remotes/${GIT_REMOTE}/${SEMVER_BRANCH}" 2> /dev/null; then
	# Checkout and reset semver branch
	if timber.sh -l debug; then
		timber.sh debug "Fetched ${SEMVER_BRANCH} from ${GIT_REMOTE}"
		git_branches
	fi

	if timber.sh -l debug; then
		timber.sh debug "Checkout ${SEMVER_BRANCH}"
	fi

	git checkout --progress -b "${SEMVER_BRANCH}" "${GIT_REMOTE}/${SEMVER_BRANCH}"

	if timber.sh -l debug; then
		git_branches
	fi

	if timber.sh -l debug; then
		timber.sh debug "Resetting ${SEMVER_BRANCH} to ${BASE_BRANCH}"
	fi
	git reset --hard "${BASE_BRANCH}"
	if timber.sh -l debug; then
		git_branches
	fi
else
	# Check if the HEAD is at the base branch
	headSha=$(git rev-parse HEAD)
	baseSha=$(git rev-parse "${BASE_BRANCH}")

	if [[ "${headSha}" != "${baseSha}" ]]; then
		mono_log error "HEAD is not at ${BASE_BRANCH}"
		mono_log debug "HEAD: ${headSha}"
		mono_log debug "${BASE_BRANCH}: ${baseSha}"
		exit 1
	fi

	# Create semver branch from base
	mono_log debug "Creating ${SEMVER_BRANCH} from ${BASE_BRANCH}"
	git checkout -b "${SEMVER_BRANCH}"
fi
