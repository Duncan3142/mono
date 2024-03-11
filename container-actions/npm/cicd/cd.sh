#!/usr/bin/env bash

set -e

export REMOTE=origin

# shellcheck source=./shell/log.sh
. log.sh

# shellcheck source=./shell/debug-env.sh
. debug-env.sh

# shellcheck source=./shell/var-guard.sh
. var-guard.sh

# shellcheck source=./shell/init-repo.sh
. init-repo.sh

REQUIRED_VARS=(
	"CHECKOUT_BRANCH"
)

var_guard "${REQUIRED_VARS[@]}"

log_info "Running install"
make install

if CHANGES_JSON=$(./shell/changes.sh >(cat)); then

	log_info "SemVer pending"

	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		log_debug "Changes JSON:"
		echo -E "${CHANGES_JSON}" | jq '.'
	fi

	BASE_BRANCH="${CHECKOUT_BRANCH}"
	# shellcheck source=./shell/version.sh
	. version.sh
else
	log_info "SemVer current"
fi

test.js

echo "Done"
