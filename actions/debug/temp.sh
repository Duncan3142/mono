#!/usr/bin/env bash

declare -A pids=()

OUTPUT_ROOT=/tmp/mono-task
mkdir -p "$OUTPUT_ROOT"

(
	echo -e "\n\nWORK DIR: $(pwd)" &&
  sleep 2s &&
	echo -e "\n\nMEOW WOOF\n\n"
) &> "$OUTPUT_ROOT/sleepy" &
pids["$!"]="$OUTPUT_ROOT/sleepy"

(
	sleep 3s &&
	echo -e "\n\nDozy\n\n" &&
	exit 1
) &> "$OUTPUT_ROOT/dozy" &
pids["$!"]="$OUTPUT_ROOT/dozy"

echo -e "\n\nRAAARRR\n\n" &> "$OUTPUT_ROOT/raaarrr" &
pids["$!"]="$OUTPUT_ROOT/raaarrr"

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
	echo "${file#"$OUTPUT_ROOT/"}"
	file="${pids[$id]}"
	cat "${file}"
	unset "pids[$id]"
done
echo "ALL DONE"
exit "$status"
