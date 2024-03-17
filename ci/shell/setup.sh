#!/usr/bin/env bash

set -ueC
echo Installing shell script...
cd scripts
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed shell scripts\n"
