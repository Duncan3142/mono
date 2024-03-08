#!/usr/bin/env bash

PACKAGE_JSON=$(cat package.json)
PACKAGE_NAME=$(echo -E "${PACKAGE_JSON}" | jq -r '.name')
PACKAGE_VERSION=$(echo -E "${PACKAGE_JSON}" | jq -r '.version')

export PACKAGE_NAME PACKAGE_VERSION
