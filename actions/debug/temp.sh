#!/usr/bin/env bash

declare -A MONO_PIDS=()
MONO_LOGS_ROOT=/tmp/mono-logs

mkdir -p "$MONO_LOGS_ROOT"

(
	echo -e "\n\nWORK DIR: $(pwd)" &&
  sleep 2s &&
	echo -e "\n\nMEOW WOOF\n\n"
) &> "$MONO_LOGS_ROOT/sleepy" &
MONO_PIDS["$!"]='sleepy'

(
	sleep 3s &&
	echo -e "\n\nDozy\n\n" &&
	exit 0
) &> "$MONO_LOGS_ROOT/dozy" &
MONO_PIDS["$!"]='dozy'

echo -e "\n\nRAAARRR\n\n" &> "$MONO_LOGS_ROOT/raaarrr" &
MONO_PIDS["$!"]='raaarrr'

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
unset MONO_PIDS MONO_LOGS_ROOT
echo "ALL DONE"
exit "$status"
