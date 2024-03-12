#!/usr/bin/env bash

declare -A pids=()
outputRoot=/tmp/mono-task

mkdir -p "$outputRoot"

(
	echo -e "\n\nWORK DIR: $(pwd)" &&
  sleep 2s &&
	echo -e "\n\nMEOW WOOF\n\n"
) &> "$outputRoot/sleepy" &
pids["$!"]='sleepy'

(
	sleep 3s &&
	echo -e "\n\nDozy\n\n" &&
	exit 0
) &> "$outputRoot/dozy" &
pids["$!"]='dozy'

echo -e "\n\nRAAARRR\n\n" &> "$outputRoot/raaarrr" &
pids["$!"]='raaarrr'

echo "${!pids[*]}"
echo "${pids[*]}"
status=0
for id in "${!pids[@]}"
do
	wait "${id}"
	last_status="$?"
	if [[ $last_status -ne 0 ]]; then
		status=1
	fi
	echo "PID: ${id}, STATUS: ${last_status}"
	file="${pids[$id]}"
	echo "${file}"
	cat "${outputRoot}/${file}"
	unset "pids[$id]"
done
unset pids outputRoot
echo "ALL DONE"
exit "$status"
