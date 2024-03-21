#!/usr/bin/env bash

set -ueC

rm -f /tmp/layin-pipe

mkfifo /tmp/layin-pipe

./b.sh /tmp/layin-pipe &
bpid=$!
if ! timeout 4s cat /tmp/layin-pipe; then
	echo "B Layin' pipe... timeout"
	exit 1
fi
if wait $bpid; then
	echo "A Layin' pipe... done"
else
	echo "B Layin' pipe... failed"
fi

rm -f /tmp/layin-pipe
wait $bpid
