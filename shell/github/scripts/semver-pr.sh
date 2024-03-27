#!/usr/bin/env bash

set -euC

pkgName=$1

timber info "Creating SemVer PR..."

if ! prUrl=$(gh pr create --base "${EVENT_BRANCH}" --head "${SEMVER_BRANCH}" --title "SemVer ${pkgName}" --body "This is an auto generated PR to semantically version ${pkgName}" --label bot --label semver); then
	prUrl=$(gh pr list --base "${EVENT_BRANCH}" --head "${SEMVER_BRANCH}" --json url --jq '.[].url')
	if [ -z "${prUrl}" ]; then
		timber error "Failed to find existing SemVer PR with base \"${EVENT_BRANCH}\" and head \"${SEMVER_BRANCH}\""
		exit 8
	fi
fi
