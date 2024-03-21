#!/usr/bin/env bash

set -ueC

pkgTag=$1
releaseFiles=$2

if gh release view "${pkgTag}"; then
	timber warn "Release ${pkgTag} already exists"
else
	mapfile -t releaseFilesArray < "$(cat "${releaseFiles}")"
	gh release create "${pkgTag}" --verify-tag --title "${pkgTag}" --notes "${pkgTag}" "${releaseFilesArray[@]}"
fi
