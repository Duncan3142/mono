#!/usr/bin/env bash

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Env:"
	for n in $(compgen -e); do echo "$n=${!n}"; done
	log_debug "Args:"
	echo -E "$@"
fi
