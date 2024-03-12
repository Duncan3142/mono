#!/usr/bin/env bash

(
	echo -e "WORK DIR: $(pwd)\n\n\n" &&
  sleep 4s &&
	echo -e "\n\n\nMEOW WOOF"
) &
env &
wait
echo "ALL DONE"
