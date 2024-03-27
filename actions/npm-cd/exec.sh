#!/usr/bin/env bash

set -ueC

export GIT_REMOTE=${GIT_REMOTE:-origin}

export SEMVER_BRANCH=${SEMVER_BRANCH_PREFIX}/${MONO_WORK_DIR}

git-init --checkout "${EVENT_BRANCH}" -b "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

pkgName=$(jq -r '.name' package.json)
npm ci

changesFile="$(mktemp)"
npm-changes "${changesFile}"

if [[ $(jq '.changes | length' "${changesFile}") -gt 0 ]]; then
	semver-branch
	npm exec -- changeset version
	if semver-commit "${pkgName}"; then
		semver-pr "${pkgName}"
	fi
else
	pkgVersion=$(jq -r '.version' package.json)
	pkgTag=${pkgName}@${pkgVersion}
	tagExitCode=0
	git-tag "${pkgTag}" || tagExitCode=$?
	if [[ $tagExitCode -eq 8 ]]; then
		exit 0
	elif [[ $tagExitCode -ne 0 ]]; then
		exit 1
	fi
	releaseFiles="$(mktemp)"
	./shell/build.sh "${releaseFiles}"
	parallel ::: "npm-publish '${pkgTag}' 2>&1" "github-release '${pkgTag}' '${releaseFiles}' 2>&1"
fi
