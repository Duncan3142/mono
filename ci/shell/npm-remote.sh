#!/usr/bin/env bash

OUTPUT=$1

if JSON=$(npm show "${NAME}@${VERSION}" --json); then
	echo -E "${JSON}" > "${OUTPUT}"
else
	timber.sh info "Package ${NAME} does not exist at version ${VERSION}"
	exit 1
fi
