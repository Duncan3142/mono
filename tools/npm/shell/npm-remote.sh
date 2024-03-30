#!/usr/bin/env bash

set -ueC
set -o pipefail

pkgTag=$1
outFile=$2

timber info "Fetching package info ${pkgTag}..."

npm show "${pkgTag}" --json >| "${outFile}" 2> /dev/null
