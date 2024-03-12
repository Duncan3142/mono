#! /usr/bin/env bash

function mono_wait {
	local -n _pids=$1
	echo "${!_pids[*]}"
	echo "${_pids[*]}"
	status=0
	for id in "${!_pids[@]}"
	do
		wait "${id}"
		last_status="$?"
		if [[ $last_status -ne 0 ]]; then
			status=1
		fi
		echo "PID: ${id}, STATUS: ${last_status}"
		file="${_pids[$id]}"
		echo "${file}"
		cat "${MONO_LOGS_ROOT}/${file}"
		unset "_pids[$id]"
	done

	return "$status"
}
