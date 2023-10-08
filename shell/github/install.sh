#!/usr/bin/env bash

set -ueC

echo Installing github scripts...
cd scripts
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed github scripts\n"
