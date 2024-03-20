#!/usr/bin/env bash

set -ueC

pkgName=$1
pkgVersion=$2
outFile=$3

if remoteJson=$(npm show "${pkgName}@${pkgVersion}" --json); then
	echo -E "${remoteJson}" > "${outFile}"
else
	exit 1
fi
