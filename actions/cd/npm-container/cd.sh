#!/usr/bin/env bash

set -e

# shellcheck source=./shell/log.sh
. log.sh

# shellcheck source=./shell/debug-env.sh
. debug-env.sh

# shellcheck source=./shell/clone-repo.sh
. clone-repo.sh

log_info "Running install"
make install

if CHANGES_JSON=$(./shell/changes.sh >(cat)); then

	log_info "SemVer pending"

	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		log_debug "Changes JSON:"
		echo -E "${CHANGES_JSON}" | jq '.'
	fi

	if [[ -z "${CLONE_BRANCH}" ]]; then
		log_error "CLONE_BRANCH is not set"
		exit 1
	fi

	REMOTE="${CLONE_REMOTE}"
	BASE_BRANCH="${CLONE_BRANCH}"
	# shellcheck source=./shell/version.sh
	. version.sh
else
	log_info "SemVer current"
fi

test.js

echo "Done"
