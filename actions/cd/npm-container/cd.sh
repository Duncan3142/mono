#!/usr/bin/env bash

set -e

# shellcheck source=./shell/log.sh
. log.sh
# shellcheck source=./shell/clone-repo.sh
. clone-repo.sh

clone_repo

node "${ACTION_DIR}/main.js" "$@"
