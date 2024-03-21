#!/usr/bin/env bash

set -ueC

gh auth login --with-token <<< "${GIT_TOKEN}"

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

outFile="$(mktemp --tmpdir='/dev/shm/')"

npm-changes "${outFile}"
changesJson=$(cat "${outFile}")

if [[ $(echo -E "${changesJson}" | jq '.changes | length') -ge 0 ]]; then
	semver-branch
	npm exec -- changeset version
	if semver-commit "${changesJson}"; then
		semver-pr "${changesJson}" "${outFile}"
	fi
else
	./shell/build.sh
	npm-publish
fi
