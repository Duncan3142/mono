#!/usr/bin/env bash

REQUIRED_VARS=(
	"BASE_BRANCH"
	"SEMVER_BRANCH"
	"REMOTE"
	"CHANGES_JSON"
)

var_guard "${REQUIRED_VARS[@]}"

# Try to fetch remote semver branch
if git fetch "${REMOTE}" --depth=1 "refs/heads/${SEMVER_BRANCH}:refs/remotes/${REMOTE}/${SEMVER_BRANCH}" 2> /dev/null; then
	# Checkout and reset semver branch
	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		log_debug "Fetched ${SEMVER_BRANCH} from ${REMOTE}"
		git --no-pager branch -a -v -v
	fi

	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		log_debug "Checkout ${SEMVER_BRANCH}"
	fi

	git checkout --progress -b "${SEMVER_BRANCH}" "${REMOTE}/${SEMVER_BRANCH}"

	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		git --no-pager branch -a -v -v
	fi

	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		log_debug "Resetting ${SEMVER_BRANCH} to ${BASE_BRANCH}"
	fi
	git reset --hard "${BASE_BRANCH}"
	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		git --no-pager branch -a -v -v
	fi
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

PKG_NAME=$(echo -E "${CHANGES_JSON}" | jq '.name')

if git commit -m "Semver ${PKG_NAME}"; then
	VERSION_UPDATED=true
	log_debug "Pushing ${SEMVER_BRANCH} to ${REMOTE}"
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
