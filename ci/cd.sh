#!/usr/bin/env bash

set -ueC

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

if CHANGES_JSON=$(npm-changes >(cat)); then
	echo "Changes detected"
	echo "${CHANGES_JSON}"
else
	echo "No changes detected"
fi
