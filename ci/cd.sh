#!/usr/bin/env bash

set -ueC

"${ACTION_DIR}/setup.sh"

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
	localJson=$(cat package.json)
	pkgName=$(echo -E "${localJson}" | jq -r '.name')
	pkgVersion=$(echo -E "${localJson}" | jq -r '.version')
	if npm-remote "$pkgName" "$pkgVersion" "${outFile}"; then
		timber warn "Package ${pkgName} already exists at version ${pkgVersion}"
		exit 0
	fi
	GIT_REMOTE=${GIT_REMOTE:-origin}
	pkgTag=${pkgName}@${pkgVersion}
	git tag "${pkgTag}"
	git push "${GIT_REMOTE}" "${pkgTag}"
	npm publish
	gh release create "${pkgTag}" --verify-tag --title "${pkgTag}" --notes "${pkgTag}"
fi
