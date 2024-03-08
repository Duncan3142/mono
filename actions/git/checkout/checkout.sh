#!/usr/bin/env bash

CREATED=false
if git checkout "${BRANCH_NAME}"; then
	echo "Ref for ${BRANCH_NAME} existed locally"
else
	echo "Ref for ${BRANCH_NAME} does not exist locally"
	# shellcheck disable=SC2153
	if [[ $CREATE == 'true' ]]; then
		git checkout -b "${BRANCH_NAME}"
		CREATED=true
		if [[ $PUSH == 'true' ]]; then
			git push -u "${REMOTE}" "${BRANCH_NAME}"
		fi
	else
		exit 1
	fi
fi

export CREATED
