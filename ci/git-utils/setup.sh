#!/usr/bin/env bash

set -ueC

echo Installing git-utils scripts...
cd shell
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed git-utils scripts\n"
