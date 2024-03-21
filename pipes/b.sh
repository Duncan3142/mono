#!/usr/bin/env bash

set -ueC

sleep 1s

echo "B Layin' pipe..." > "$1" &
epid=$!
sleep 2s
wait $epid
echo "B Layin' pipe... done"

exit 0
