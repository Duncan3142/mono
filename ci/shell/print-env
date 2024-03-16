#!/usr/bin/env bash

set -ueC

if timber.sh -l debug; then
	timber.sh debug "Env:"
	for n in $(compgen -e); do echo "$n=${!n}"; done
	timber.sh debug "Args:"
	echo -E "$@"
fi
