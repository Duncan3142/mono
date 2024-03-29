#!/usr/bin/env bash

set -ueC
set -o pipefail

inFile="$1"
outFile="$2"

input=$(cat "$inFile")

echo Running c.sh

echo -E "$input" | grep "o" > "$outFile"
