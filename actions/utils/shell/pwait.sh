#! /usr/bin/env bash

function mono_pwait {
	local -n _pids=${1:?}
	_pids=${_pids:()}
	if [[ "${_pids[*]}" == "()" ]]; then
		echo "Invalid wait reference: $1"
		return 1
	fi
	echo "${!_pids[*]}"
	echo "${_pids[*]}"
	local status=0
	for id in "${!_pids[@]}"
	do
		wait "${id}"
		local last_status="$?"
		if [[ $last_status -ne 0 ]]; then
			status=1
		fi
		echo "PID: ${id}, STATUS: ${last_status}"
		file="${_pids[$id]}"
		echo "${file}"
		cat "${MONO_LOGS_ROOT}/${file}"
	done

	return $status
}
