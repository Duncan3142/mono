#!/usr/bin/env bash

set -ueC
set -o pipefail

echo Installing bash scripts...
cd scripts
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed bash scripts\n"
