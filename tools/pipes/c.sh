#!/usr/bin/env bash

set -ueC
set -o pipefail

inFile="$1"
outFile="$2"

tempFile=$(mktemp)

function return () {
	rm -f "${tempFile}"
}

trap "return" EXIT

cp "$inFile" "$tempFile"

echo Running c.sh

grep "o" < "$tempFile" > "$outFile"
