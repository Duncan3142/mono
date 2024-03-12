#!/usr/bin/env bash

# shellcheck source=./log.sh
. mono-log.sh

set -e -u

CHANGES_JSON=$1
SEMVER_BRANCH=$2
REMOTE=$3
PKG_NAME=$4

git add .

PKG_NAME=$(echo -E "${CHANGES_JSON}" | jq '.name')

if git commit -m "Semver ${PKG_NAME}"; then
	mono_log debug "Pushing ${SEMVER_BRANCH} to ${REMOTE}"
	git push --force-with-lease "${REMOTE}" "${SEMVER_BRANCH}"
	exit 0
fi

exit 1
