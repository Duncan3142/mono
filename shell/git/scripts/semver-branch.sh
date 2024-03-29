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

timber info "Checkout SemVer branch..."

if timber -l debug; then
	timber debug "Refs pre checkout"
	git-refs
fi

# Try to fetch remote semver branch
if git checkout --progress "${SEMVER_BRANCH}"; then
	if timber -l debug; then
		timber debug "Resetting ${SEMVER_BRANCH} to ${EVENT_BRANCH}"
	fi
	git reset --hard "${EVENT_BRANCH}"
else
	# Check if the HEAD is at the base branch
	headSha=$(git rev-parse HEAD)
	baseSha=$(git rev-parse "${EVENT_BRANCH}")

	if [[ "${headSha}" != "${baseSha}" ]]; then
		timber error "HEAD is not at ${EVENT_BRANCH}"
		timber debug "HEAD: ${headSha}"
		timber debug "${EVENT_BRANCH}: ${baseSha}"
		exit 1
	fi

	# Create semver branch from base
	timber debug "Creating ${SEMVER_BRANCH} from ${EVENT_BRANCH}"
	git checkout --progress -b "${SEMVER_BRANCH}"
fi

if timber -l debug; then
	timber debug "Refs post checkout:"
	git-refs
fi
