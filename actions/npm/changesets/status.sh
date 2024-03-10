#!/usr/bin/env bash

mkdir -p .tmp
npm exec changeset -- status --output=".tmp/changes_status.json"
STATUS_JSON=$(cat ./.tmp/changes_status.json)
rm ./.tmp/changes_status.json
CHANGE_COUNT=$(echo -E "${STATUS_JSON}" | jq '.changesets | length')
echo "Changeset count: ${CHANGE_COUNT}"

export CHANGE_COUNT
