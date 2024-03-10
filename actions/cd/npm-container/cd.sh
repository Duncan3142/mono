#!/usr/bin/env bash

set -e

# shellcheck source=./shell/log.sh
. log.sh
# shellcheck source=./shell/clone-repo.sh
. clone-repo.sh
# shellcheck source=./shell/changesets.sh
. changesets.sh

clone_repo

npm ci

if JSON=$(changesets_status >(cat)); then
	log_info "Changesets pending"
	echo -E "${JSON}" | jq '.'
else
	log_info "No changesets pending"
fi

node "${ACTION_DIR}/main.js" "$@"

echo "Done didly done"
