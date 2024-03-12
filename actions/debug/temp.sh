#!/usr/bin/env bash

pids=()

(
	echo -e "WORK DIR: $(pwd)\n\n\n" &&
  sleep 4s &&
	echo -e "\n\n\nMEOW WOOF"
) &> /tmp/sleepy.txt &
pids+=($!)
(sleep 1s && exit 0) &
pids+=($!)
env &> /tmp/env.txt &
pids+=($!)
echo "${pids[*]}"
status=0
for i in "${!pids[@]}"
do
	if ! wait "${pids[i]}"; then
		status=1
	fi
	unset "pids[$i]"
done
echo "SLEEPY.TXT"
cat /tmp/sleepy.txt
echo ""
echo "ENV.TXT"
cat /tmp/env.txt
echo ""
echo "ALL DONE"
exit "${status}"
