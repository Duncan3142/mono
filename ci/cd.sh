#!/usr/bin/env bash

set -ueC

"${ACTION_DIR}/setup.sh"

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

if CHANGES_JSON=$(npm-changes >(cat)); then
	echo "Changes detected"
	echo -E "${CHANGES_JSON}" | jq '.'
else
	echo "No changes detected"
fi
