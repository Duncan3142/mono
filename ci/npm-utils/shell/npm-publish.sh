#!/usr/bin/env bash

set -ueC

pkgTag=$1

if npm-remote "${pkgTag}" '/dev/null'; then
	timber warn "Package ${pkgTag} already published"
else
	npm publish
fi
