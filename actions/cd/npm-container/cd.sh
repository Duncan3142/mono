#!/usr/bin/env bash

set -e

# shellcheck source=./shell/log.sh
. log.sh
# shellcheck source=./shell/clone-repo.sh
. clone-repo.sh
# shellcheck source=./shell/debug.sh
. debug.sh

debug_env "$@"

clone_repo

make install

if JSON=$(./shell/changes.sh >(cat)); then
	log_info "SemVer pending"
	echo -E "${JSON}" | jq '.'
else
	log_info "SemVer current"
fi

# node "${ACTION_DIR}/main.js" "$@"

echo "Done"
