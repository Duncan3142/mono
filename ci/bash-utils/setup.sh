#!/usr/bin/env bash

set -ueC

echo Installing bash-utils scripts...
cd shell
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed bash-utils scripts\n"
