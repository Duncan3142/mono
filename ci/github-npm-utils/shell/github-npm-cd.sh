#!/usr/bin/env bash

set -ueC

export GIT_REMOTE=${GIT_REMOTE:-origin}

gh auth login --with-token <<< "${GIT_TOKEN}"

git-init --checkout "${BASE_BRANCH}" --fetch "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

changesFile="$(mktemp)"

npm-changes "${changesFile}"

if [[ $(jq '.changes | length' "${changesFile}") -ge 0 ]]; then
	semver-branch
	npm exec -- changeset version
	pkgName=$(jq -r '.pkg.name' "${changesFile}")
	if semver-commit "${pkgName}"; then
		semver-pr "${pkgName}"
	fi
else
	releaseFiles="$(mktemp)"
	./shell/build.sh "${releaseFiles}"
	npm-publish "${releaseFiles}"
fi
