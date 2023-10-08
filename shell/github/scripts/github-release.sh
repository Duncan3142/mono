#!/usr/bin/env bash

set -ueC

releaseTag=$1
releaseFiles=$2

if gh release view "${releaseTag}"; then
	timber warn "Release ${releaseTag} already exists"
else
	mapfile -t releaseFilesArray < "${releaseFiles}"
	timber debug 'Release files:' "${releaseFilesArray[@]}"
	gh release create "${releaseTag}" --verify-tag --title "${releaseTag}" --notes "${releaseTag}" "${releaseFilesArray[@]}"
fi
