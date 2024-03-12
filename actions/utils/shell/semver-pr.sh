#!/usr/bin/env bash

# shellcheck source=./log.sh
. mono-log.sh

set -e -u

BASE_BRANCH=$1
SEMVER_BRANCH=$2
PKG_NAME=$3
OUT_FILE=$4

if ! PR_URL=$(gh pr create --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --title "SemVer ${PKG_NAME}" --body "This is an auto generated PR to semantically version ${PKG_NAME}" --label bot --label semver); then
	PR_URL=$(gh pr list --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --json url --jq '.[0].url')
	if [ -z "${PR_URL}" ]; then
		mono_log error "Failed to find existing SemVer PR with base \"${BASE_BRANCH}\" and head \"${SEMVER_BRANCH}\""
		exit 1
	fi
fi

echo -E "PR_URL=${PR_URL}" > "${OUT_FILE}"
