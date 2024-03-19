#!/usr/bin/env bash

set -ueC

"${ACTION_DIR}/setup.sh"

gh auth login --with-token <<< "${GIT_TOKEN}"

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

outfile="$(mktemp --tmpdir='/dev/shm/')"

npm-changes "${outfile}"
changesJson=$(cat "${outfile}")

if [[ $(echo -E "${changesJson}" | jq '.changes | length') -ge 0 ]]; then
	semver-branch
	npm exec -- changeset version
	if semver-commit "${changesJson}"; then
		semver-pr "${changesJson}" "${outfile}"
	fi
else
	echo "No changes detected"
fi
