#!/usr/bin/env bash

set -ueC

cd "${ACTION_DIR}"

mkdir -p "${LBIN}"
mkdir -p "${LLIB}"

parallel ::: 'cd shell && ./setup.sh' 'cd chalk && ./setup.sh'

echo "All done"
