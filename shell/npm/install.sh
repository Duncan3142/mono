#!/usr/bin/env bash

set -ueC

echo Installing npm scripts...
cd scripts
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed npm scripts\n"
