#!/usr/bin/env bash

set -ueC
set -o pipefail

inFile="$1"

tempFile=$(mktemp)

function return () {
	rm -f "${tempFile}"
}

trap "return" EXIT

cp "$inFile" "$tempFile"

echo Running d.sh

grep "Me" < "$tempFile"
