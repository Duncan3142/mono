#!/usr/bin/env bash

set -ueC

pkgTag=$1

outFile=$(mktemp)
remoteStatus=0
npm-remote "${pkgTag}" "$outFile" || remoteStatus=$?
if [[ $remoteStatus -eq 0 ]]; then
	timber warn "Package ${pkgTag} already published"
	exit 0
fi

errCode=$(jq -r '.error.code' "${outFile}")
if [[ $errCode == 'E404' ]]; then
	npm publish
	exit 0
fi

exit "$remoteStatus"
