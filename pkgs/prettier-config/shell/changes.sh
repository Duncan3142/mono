#!/usr/bin/env bash

OUTPUT_FILE=$1
mkdir -p .tmp
STATUS_FILE=".tmp/$(cat /proc/sys/kernel/random/uuid)"
touch "${STATUS_FILE}"
npm exec -- changeset status --output="${STATUS_FILE}" &> /dev/null
STATUS_JSON=$(cat "${STATUS_FILE}")
rm "${STATUS_FILE}"
PENDING_RELEASE_COUNT=$(echo -E "${STATUS_JSON}" | jq -r '.releases | length')
echo -E "${STATUS_JSON}" > "$OUTPUT_FILE"
if [[ $PENDING_RELEASE_COUNT -gt 0 ]]; then
	exit 0
else
	exit 1
fi
