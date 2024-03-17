#!/usr/bin/env bash

set -ueC

cd "${ACTION_DIR}"

mkdir -p "${LBIN}"
mkdir -p "${LLIB}"

parallel ::: \
	'cd bash-utils && ./setup.sh' \
	'cd chalk && ./setup.sh' \
	'cd git-utils && ./setup.sh' \
	'cd github-utils && ./setup.sh' \
	'cd npm-utils && ./setup.sh'

echo "All done"
