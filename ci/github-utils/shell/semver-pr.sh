#!/usr/bin/env bash

set -euC

CHANGES_JSON=$1
OUT_FILE=$2

pkgName=$(jq -r '.pkg.name' <<< "${CHANGES_JSON}")

if ! PR_URL=$(gh pr create --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --title "SemVer ${pkgName}" --body "This is an auto generated PR to semantically version ${pkgName}" --label bot --label semver); then
	PR_URL=$(gh pr list --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --json url --jq '.[].url')
	if [ -z "${PR_URL}" ]; then
		timber error "Failed to find existing SemVer PR with base \"${BASE_BRANCH}\" and head \"${SEMVER_BRANCH}\""
		exit 1
	fi
fi

echo -E "PR_URL=${PR_URL}" >| "${OUT_FILE}"
