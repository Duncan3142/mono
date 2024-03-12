#!/usr/bin/env bash

# shellcheck source=./log.sh
. mono-log.sh

set -u -e

if mono_log_level debug; then
	mono_log debug "Env:"
	for n in $(compgen -e); do echo "$n=${!n}"; done
	mono_log "Args:"
	echo -E "$@"
fi
