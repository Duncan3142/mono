#!/usr/bin/env bash

function coexit() {
	local -
	set +e
	wait $!
	status="$?"
	exec >&-
	read -r
	exit $status
}

function await() {
	local -
	set +e
	while read -u "${1}" -r line; do
		echo -E "$line"
	done
	echo '' >&"${2}"
}

function costatus() {
	local -i status=0
	for id in "$@"; do
		wait "${id}"
		last_status="$?"
		if [[ $last_status -ne 0 ]]; then
			status=1
		fi
	done
	return $status
}
