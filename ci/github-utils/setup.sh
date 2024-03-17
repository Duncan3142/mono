#!/usr/bin/env bash

set -ueC

echo Installing github-utils scripts...
cd shell
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed github-utils scripts\n"
