#!/usr/bin/env bash

set -ueC
set -o pipefail

function return () {
	# shellcheck disable=SC2317
	case $? in
		64) echo 64; exit 0 ;;
		0) echo 0 ;;
		*) echo other; exit 1 ;;
	esac
}

trap "return" EXIT

exit 64
