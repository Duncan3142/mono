#!/usr/bin/env bash

set -ueC
set -o pipefail

function return () {
	rm -f "${changesFile}" "${releaseFiles}"
}

trap "return" EXIT

export SEMVER_BRANCH=${SEMVER_BRANCH_PREFIX}/${MONO_WORK_DIR}

git-init --checkout "${EVENT_BRANCH}" -b "${SEMVER_BRANCH}"

cd "${MONO_WORK_DIR}"

pkgName=$(jq -r '.name' package.json)
npm-install

changesFile="$(mktemp)"
npm-changes "${changesFile}"

if [[ $(jq '.changes | length' "${changesFile}") -gt 0 ]]; then
	semver-branch
	npm-semver
	if semver-commit "${pkgName}"; then
		semver-pr "${pkgName}"
	fi
else
	pkgVersion=$(jq -r '.version' package.json)
	pkgTag=${pkgName}@${pkgVersion}
	{ git-tag "${pkgTag}"; tagCode=$?; } || true
	case "${tagCode}" in
		64) exit 0 ;;
		0) ;;
		*) exit 1 ;;
	esac
	releaseFiles="$(mktemp)"
	timber info "Run build..."
	./shell/build.sh "${releaseFiles}"
	parallel ::: "npm-publish '${pkgTag}' 2>&1" "github-release '${pkgTag}' '${releaseFiles}' 2>&1"
fi
