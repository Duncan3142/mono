#!/usr/bin/env bash

set -ueC
set -o pipefail

tempFiles=()

function return () {
	rm -f "${tempFiles[@]}"
}

trap "return" EXIT

export SEMVER_BRANCH=${SEMVER_BRANCH_PREFIX}/${MONO_WORK_DIR}

git-init --checkout "${EVENT_BRANCH}" -b "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

pkgName=$(jq -r '.name' package.json)
npm-install

changesFile="$(mktemp)"
tempFiles+=("${changesFile}")
npm-changes "${changesFile}"

if [[ $(jq '.changes | length' "${changesFile}") -gt 0 ]]; then
	semver-branch
	npm-semver
	if semver-commit "${pkgName}"; then
		semver-pr "${pkgName}"
	fi
else
	{ pkgVersion=$(npm-get-version); versionCode=$?; } || true
	case "${versionCode}" in
		64) exit 0 ;;
		0) ;;
		*) exit 1 ;;
	esac
	pkgTag=${pkgName}@${pkgVersion}
	{ git-tag "${pkgTag}"; tagCode=$?; } || true
	case "${tagCode}" in
		64) exit 0 ;;
		0) ;;
		*) exit 1 ;;
	esac
	releaseFiles="$(mktemp)"
	tempFiles+=("${releaseFiles}")
	timber info "Run build..."
	./cicd/build.sh "${releaseFiles}"
	parallel ::: "npm-publish '${pkgTag}' 2>&1" "github-release '${pkgTag}' '${releaseFiles}' 2>&1"
fi
