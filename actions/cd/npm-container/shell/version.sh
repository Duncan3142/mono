#!/usr/bin/env bash

if [[ -z "${BASE_BRANCH}" ]]; then
	log_error "BASE_BRANCH is not set"
	exit 1
fi

if [[ -z "${SEMVER_BRANCH}" ]]; then
	log_error "SEMVER_BRANCH is not set"
	exit 1
fi

if [[ -z "${REMOTE}" ]]; then
	log_error "REMOTE is not set"
	exit 1
fi

if [[ -z "${1}" ]]; then
	log_error "CHANGES_FILE is not set"
	exit 1
else
	CHANGES_FILE=$1
fi

# Try to fetch remote semver branch
if git fetch "${REMOTE}" --depth=1 "refs/heads/${SEMVER_BRANCH}:refs/remotes/${REMOTE}/${SEMVER_BRANCH}"; then
	log_debug "Fetched ${SEMVER_BRANCH} from ${REMOTE}"
	git --no-pager branch -a
	# Checkout and reset semver branch
	git checkout -b "${SEMVER_BRANCH}" "remotes/${REMOTE}/${SEMVER_BRANCH}"
	log_debug "Resetting ${SEMVER_BRANCH} to ${BASE_BRANCH}"
	git reset --hard "${BASE_BRANCH}"
else
	# Check if the HEAD is at the base branch
	HEAD_SHA=$(git rev-parse HEAD)
	BASE_SHA=$(git rev-parse "${BASE_BRANCH}")

	if [[ "${HEAD_SHA}" != "${BASE_SHA}" ]]; then
		log_error "HEAD is not at ${BASE_BRANCH}"
		log_debug "HEAD: ${HEAD_SHA}"
		log_debug "${BASE_BRANCH}: ${BASE_SHA}"
		exit 1
	fi

	unset HEAD_SHA BASE_SHA

	# Create semver branch from base
	log_debug "Creating ${SEMVER_BRANCH} from ${BASE_BRANCH}"
	git checkout -b "${SEMVER_BRANCH}"
fi

make version

# Commit changes
VERSION_UPDATED=false

git add .

PKG_NAME=$(jq '.name' "$CHANGES_FILE")

if git commit -m "Semver ${PKG_NAME}"; then
	VERSION_UPDATED=true
	git push --force-with-lease "${REMOTE}" "${SEMVER_BRANCH}"
fi

# Create PR

if ! PR_URL=$(gh pr create --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --title "SemVer ${PKG_NAME}" --body "This is an auto generated PR to semantically version ${PKG_NAME}" --label bot --label semver); then
	PR_URL=$(gh pr list --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --json url --jq '.[0].url')
	if [ -z "${PR_URL}" ]; then
		log_error "Failed to find existing SemVer PR with base \"${BASE_BRANCH}\" and head \"${SEMVER_BRANCH}\""
		exit 1
	fi

	# ::TODO:: Update PR
fi

# gh pr merge --auto --squash

unset PKG_NAME

export VERSION_UPDATED PR_URL
