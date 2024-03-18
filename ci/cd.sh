#!/usr/bin/env bash

set -ueC

"${ACTION_DIR}/setup.sh"

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

changesJson=$(npm-changes >(cat))

if [[ $(echo -E "${changesJson}" | jq '.changes | length') -ge 0 ]]; then
	echo "Changes detected"
else
	echo "No changes detected"
fi
