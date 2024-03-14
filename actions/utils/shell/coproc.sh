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
	echo '' >&"${2}"
}
