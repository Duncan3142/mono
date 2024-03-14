#!/usr/bin/env bash

function coexit() {
	wait $!
	status="$?"
	exec >&-
	read -r
	exit $status
}

function await() {
	{
		while read -u "${1}" -r line; do
			echo -E "$line"
		done
	} || true
	echo '' >&"${2}" || true
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
