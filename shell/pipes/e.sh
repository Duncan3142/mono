#!/usr/bin/env bash

set -ueC
set -o pipefail

tagExitCode=2

case "${tagExitCode}" in
	64) echo 64; exit 0 ;;
	0) echo 0 ;;
	*) echo other; exit 1 ;;
esac
