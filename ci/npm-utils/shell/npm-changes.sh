#!/usr/bin/env bash

set -ueC

OUTPUT_FILE=$1
mkdir -p .tmp
STATUS_FILE=".tmp/$(cat /proc/sys/kernel/random/uuid)"
touch "${STATUS_FILE}"
npm exec -- changeset status --output="${STATUS_FILE}"
RAW_STATUS_JSON=$(cat "${STATUS_FILE}")
rm "${STATUS_FILE}"

set +e
read -r -d '' JQ_TRANSFORM << EOF
if .releases | length > 0 then
	{
		release: .releases[0] | {name: .name, type: .type, oldVersion: .oldVersion, newVersion: .newVersion},
		changes: .changesets | map_values({summary: .summary, id: .id})
	}
else
	{
		release: null,
		changes: .changesets | map_values({summary: .summary, id: .id})
	}
end
EOF
set -e

STATUS_JSON=$(echo -E "${RAW_STATUS_JSON}" | jq "${JQ_TRANSFORM}")
echo -E "${STATUS_JSON}" > "$OUTPUT_FILE"
