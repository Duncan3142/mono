#!/usr/bin/env bash

set -ueC
set -o pipefail

fileName=$(mktemp -d)/pipe
mkfifo "$fileName"
echo "$fileName"
