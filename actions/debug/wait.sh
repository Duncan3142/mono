#! /usr/bin/env bash

function mono_wait {
	# declare -n innerPids=$1
	echo "${!MONO_PIDS[*]}"
	echo "${MONO_PIDS[*]}"
	status=0
	for id in "${!MONO_PIDS[@]}"
	do
		wait "${id}"
		last_status="$?"
		if [[ $last_status -ne 0 ]]; then
			status=1
		fi
		echo "PID: ${id}, STATUS: ${last_status}"
		file="${MONO_PIDS[$id]}"
		echo "${file}"
		cat "${MONO_LOGS_ROOT}/${file}"
		unset "MONO_PIDS[$id]"
	done

	return "$status"
}
