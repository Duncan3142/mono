#!/usr/bin/env bash

set -ueC

OUTPUT_FILE=$1
mkdir -p .tmp
STATUS_FILE=".tmp/$(cat /proc/sys/kernel/random/uuid)"
touch "${STATUS_FILE}"
npm exec -- changeset status --output="${STATUS_FILE}"
RAW_STATUS_JSON=$(cat "${STATUS_FILE}")
rm "${STATUS_FILE}"

counts=$(echo -E "${RAW_STATUS_JSON}" | jq -r "(.releases | length), (.changesets | length)")
mapfile -t array <<< "$counts"
releaseCount=${array[0]}
changeCount=${array[1]}

if [ "$releaseCount" -eq 0 ] && [ "$changeCount" -gt 0 ]; then
	timber error "Empty changeset"
	exit 1
fi

if [ "$changeCount" -eq 0 ]; then
	timber debug "No changes"
	cat <<- EOF > "$OUTPUT_FILE"
	{
	  "release": null,
	  "changes": []
	}
	EOF
	exit 0
fi

timber debug "Pending changes"

function transform () {
	cat <<- EOF
	{
	  pkg: .releases[0] | {name: .name, type: .type, oldVersion: .oldVersion, newVersion: .newVersion},
	  changes: .changesets | map_values({summary: .summary, id: .id})
	}
	EOF
}

echo -E "$RAW_STATUS_JSON" | jq "$(transform)" >| "$OUTPUT_FILE"
