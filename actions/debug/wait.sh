#! /usr/bin/env bash

function mono_wait {
	declare -n innerPids=$1
	echo "${!innerPids[*]}"
	echo "${innerPids[*]}"
	status=0
	for id in "${!innerPids[@]}"
	do
		wait "${id}"
		last_status="$?"
		if [[ $last_status -ne 0 ]]; then
			status=1
		fi
		echo "PID: ${id}, STATUS: ${last_status}"
		file="${innerPids[$id]}"
		echo "${file}"
		cat "${MONO_LOGS_ROOT}/${file}"
		unset "innerPids[$id]"
	done

	return "$status"
}
