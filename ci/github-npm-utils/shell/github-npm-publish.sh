#!/usr/bin/env bash

set -ueC

releaseFiles=$1

pkgName=$(jq -r '.name' package.json)
pkgVersion=$(jq -r '.version' package.json)
pkgTag=${pkgName}@${pkgVersion}

git-tag "${pkgTag}"

parallel ::: "npm-publish '${pkgTag}'" "github-release '${pkgTag}' '${releaseFiles}'"
