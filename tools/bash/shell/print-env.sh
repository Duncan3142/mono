#!/usr/bin/env bash

set -ueC
set -o pipefail

if timber -l debug; then
	timber debug "Env:"
	for n in $(compgen -e); do echo "$n=${!n}"; done
	timber debug "Args:"
	echo -E "$@"
fi
