#!/usr/bin/env bash

set -ueC

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

outFile="$(mktemp --tmpdir='/dev/shm/')"

if npm-remote "$pkgName" "$pkgVersion" "${outFile}"; then
	timber warn "Package ${pkgTag} already published"
	pkgPublished=true
fi

GIT_REMOTE=${GIT_REMOTE:-origin}

if [[ "${pkgTagged}" == false ]] ; then
	git tag "${pkgTag}"
	git push "${GIT_REMOTE}" "${pkgTag}"
fi

if [[ "${pkgPublished}" == false ]]; then
	npm publish
fi

if gh release view "${pkgTag}"; then
	timber warn "Release ${pkgTag} already exists"
	pkgReleased=true
fi

if [[ "${pkgReleased}" == false ]]; then
	gh release create "${pkgTag}" --verify-tag --title "${pkgTag}" --notes "${pkgTag}"
fi
