#!/usr/bin/env bash

set -ueC

pkgTag=$1
files=$2

if gh release view "${pkgTag}"; then
	timber warn "Release ${pkgTag} already exists"
else
	gh release create "${pkgTag}" --verify-tag --title "${pkgTag}" --notes "${pkgTag}"
fi
