#!/usr/bin/env bash

# shellcheck source=./log.sh
. mono-log.sh

function git_branches () {
	git --no-pager branch -a -v -v
}

set -e -u

# Try to fetch remote semver branch
if git fetch "${REMOTE}" --depth=1 "refs/heads/${SEMVER_BRANCH}:refs/remotes/${REMOTE}/${SEMVER_BRANCH}" 2> /dev/null; then
	# Checkout and reset semver branch
	if mono_log_level debug; then
		mono_log debug "Fetched ${SEMVER_BRANCH} from ${REMOTE}"
		git_branches
	fi

	if mono_log_level debug; then
		mono_log debug "Checkout ${SEMVER_BRANCH}"
	fi

	git checkout --progress -b "${SEMVER_BRANCH}" "${REMOTE}/${SEMVER_BRANCH}"

	if mono_log_level debug; then
		git_branches
	fi

	if mono_log_level debug; then
		mono_log debug "Resetting ${SEMVER_BRANCH} to ${BASE_BRANCH}"
	fi
	git reset --hard "${BASE_BRANCH}"
	if mono_log_level debug; then
		git_branches
	fi
else
	# Check if the HEAD is at the base branch
	HEAD_SHA=$(git rev-parse HEAD)
	BASE_SHA=$(git rev-parse "${BASE_BRANCH}")

	if [[ "${HEAD_SHA}" != "${BASE_SHA}" ]]; then
		mono_log error "HEAD is not at ${BASE_BRANCH}"
		mono_log debug "HEAD: ${HEAD_SHA}"
		mono_log debug "${BASE_BRANCH}: ${BASE_SHA}"
		exit 1
	fi

	unset HEAD_SHA BASE_SHA

	# Create semver branch from base
	mono_log debug "Creating ${SEMVER_BRANCH} from ${BASE_BRANCH}"
	git checkout -b "${SEMVER_BRANCH}"
fi
