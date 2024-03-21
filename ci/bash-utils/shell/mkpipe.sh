#!/usr/bin/env bash

set -ueC

fileName=$(mktemp -d)/pipe
mkfifo "$fileName"
echo "$fileName"
