#!/usr/bin/env bash

set -ueC
set -o pipefail

echo Installing git scripts...
cd scripts
while read -r script; do
	cp "$script" "$LBIN/${script%.*}"
done < <(ls -1)
echo -e "Installed git scripts\n"
