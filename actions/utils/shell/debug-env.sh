#!/usr/bin/env bash

set -u -e

# shellcheck source=./log.sh
. mono-log.sh

if mono_log_level debug; then
	mono_log debug "Env:"
	for n in $(compgen -e); do echo "$n=${!n}"; done
	mono_log "Args:"
	echo -E "$@"
fi
