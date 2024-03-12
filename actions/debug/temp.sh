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

. ./wait.sh

if ! mono_wait; then
	exit 1
fi

unset MONO_PIDS MONO_LOGS_ROOT
echo "ALL DONE"
