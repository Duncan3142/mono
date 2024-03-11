#!/usr/bin/env bash

function var_guard {
	req=("$@")
	for var in "${req[@]}"
	do
		if [[ -z "${!var}" ]]; then
			log_error "$var is not set"
			exit 1
		fi
	done
}

export -f var_guard
