#!/usr/bin/env bash

set -e

# shellcheck source=./shell/log.sh
. log.sh

debug-env.sh

# shellcheck source=./shell/clone-repo.sh
. clone-repo.sh

log_info "Running install"
make install

if JSON=$(./shell/changes.sh >(cat)); then
	log_info "SemVer pending"
	echo -E "${JSON}" | jq '.'

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
