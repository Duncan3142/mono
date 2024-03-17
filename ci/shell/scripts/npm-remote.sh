#!/usr/bin/env bash

set -ueC

OUTPUT=$1

if JSON=$(npm show "${NAME}@${VERSION}" --json); then
	echo -E "${JSON}" > "${OUTPUT}"
else
	timber info "Package ${NAME} does not exist at version ${VERSION}"
	exit 1
fi
