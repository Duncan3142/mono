#!/usr/bin/env bash

set -ueC

pkgTag=$1
outFile=$2

npm show "${pkgTag}" --json >| "${outFile}" 2> /dev/null
