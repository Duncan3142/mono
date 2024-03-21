#!/usr/bin/env bash

set -euC

pkgName=$1

if ! prUrl=$(gh pr create --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --title "SemVer ${pkgName}" --body "This is an auto generated PR to semantically version ${pkgName}" --label bot --label semver); then
	prUrl=$(gh pr list --base "${BASE_BRANCH}" --head "${SEMVER_BRANCH}" --json url --jq '.[].url')
	if [ -z "${prUrl}" ]; then
		timber error "Failed to find existing SemVer PR with base \"${BASE_BRANCH}\" and head \"${SEMVER_BRANCH}\""
		exit 1
	fi
fi
