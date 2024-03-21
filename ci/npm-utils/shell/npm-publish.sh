#!/usr/bin/env bash

set -ueC

pkgTag=$1

outFile=$(mktemp)

if npm-remote "${pkgTag}" "${outFile}"; then
	timber warn "Package ${pkgTag} already published"
else
	npm publish
fi

rm "${outFile}"
