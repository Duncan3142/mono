#!/usr/bin/env bash

set -ueC
set -o pipefail

inFile="$1"

input=$(cat "$inFile")

echo Running d.sh

echo -E "$input" | grep "Me"
