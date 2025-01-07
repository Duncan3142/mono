#!/usr/bin/env bash

set -ueC
set -o pipefail

pkgVersion=$(jq -r '.version' package.json)

case "${pkgVersion}" in
	'0.0.0')
		timber info "Package version at '0.0.0', aborting."
		exit 64
		;;
	'null')
		timber info 'Package version not set, aborting.'
		exit 64
		;;
esac

echo "${pkgVersion}"
