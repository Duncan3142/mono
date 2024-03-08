#!/usr/bin/env bash

EXISTS=false
LATEST='0.0.0'
if JSON=$(pnpm show "${NAME}@${VERSION}" --json); then
	EXISTS=true
	echo "Package ${NAME} already exists at version ${VERSION}"

	LATEST=$(echo -E "${JSON}" | jq -r '."dist-tags".latest')
	echo "Latest version is ${LATEST}"
else
	echo "Package ${NAME} does not exist at version ${VERSION}"
fi

export EXISTS LATEST
