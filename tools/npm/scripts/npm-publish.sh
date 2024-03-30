#!/usr/bin/env bash

set -ueC
set -o pipefail

function return () {
	rm -f "${outFile}"
}

trap "return" EXIT

pkgTag=$1

timber info "Publishing package ${pkgTag}..."

outFile=$(mktemp)

{ npm-remote "${pkgTag}" "$outFile"; remoteStatus=$?; } || true
if [[ $remoteStatus -eq 0 ]]; then
	timber warn "Package ${pkgTag} already published"
	exit 0
fi

errCode=$(jq -r '.error.code' "${outFile}")
if [[ $errCode == 'E404' ]]; then
	npm publish
else
	exit "$remoteStatus"
fi
