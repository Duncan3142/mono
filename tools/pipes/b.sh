#!/usr/bin/env bash

set -ueC
set -o pipefail

outFile="$1"

echo Running b.sh

echo "Meow" > "$outFile"
echo "Woof" > "$outFile"
