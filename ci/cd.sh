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
	pkgTag=${pkgName}@${pkgVersion}
	pkgPublished=false
	pkgTagged=false
	pkgReleased=false

	if tagSha=$(git show-ref --tags "/refs/tags/${pkgTag}"); then
		timber warn "Tag ${pkgTag} already exists"
		if [[ "${tagSha}" != "$(git rev-parse HEAD)" ]]; then
			timber error "Tag ${pkgTag} does not reference ${BASE_BRANCH} HEAD"
			exit 1
		fi
		pkgTagged=true
	fi

	if npm-remote "$pkgName" "$pkgVersion" "${outFile}"; then
		timber warn "Package ${pkgTag} already published"
		pkgPublished=true
	fi

	GIT_REMOTE=${GIT_REMOTE:-origin}

	if [[ "${pkgPublished}" == false ]]; then
		npm publish
	fi

	if [[ "${pkgTagged}" == false ]] ; then
		git tag "${pkgTag}"
		git push "${GIT_REMOTE}" "${pkgTag}"
	fi

	if gh release view "${pkgTag}"; then
		timber warn "Release ${pkgTag} already exists"
		pkgReleased=true
	fi

	if [[ "${pkgReleased}" == false ]]; then
		gh release create "${pkgTag}" --verify-tag --title "${pkgTag}" --notes "${pkgTag}"
	fi

fi
