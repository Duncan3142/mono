#!/usr/bin/env bash

declare -A pids=()

mkdir -p "${MONO_LOGS_ROOT:?}"

(
	echo -e "\n\nWORK DIR: $(pwd)" &&
  sleep 2s &&
	echo -e "\n\nMEOW WOOF\n\n"
) &> "$MONO_LOGS_ROOT/sleepy" &
pids["$!"]='sleepy'

(
	sleep 3s &&
	echo -e "\n\nDozy\n\n" &&
	exit 1
) &> "$MONO_LOGS_ROOT/dozy" &
pids["$!"]='dozy'

echo -e "\n\nRAAARRR\n\n" &> "$MONO_LOGS_ROOT/raaarrr" &
# shellcheck disable=SC2034
pids["$!"]='raaarrr'

# shellcheck source=./wait.sh
. mono-wait.sh

if ! mono_wait pids; then
	echo "Error"
	exit 1
fi

echo "ALL DONE"
