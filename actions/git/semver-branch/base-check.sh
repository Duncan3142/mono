#!/usr/bin/env bash

HEAD_SHA=$(git rev-parse HEAD)
BASE_SHA=$(git rev-parse "${BASE_BRANCH}")

if [[ "${HEAD_SHA}" != "${BASE_SHA}" ]]; then
	echo "HEAD is not at ${BASE_BRANCH}"
	echo "HEAD: ${HEAD_SHA}"
	echo "${BASE_BRANCH}: ${BASE_SHA}"
	exit 1
fi
