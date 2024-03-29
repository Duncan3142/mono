#!/usr/bin/env bash

set -ueC
set -o pipefail

outFile=$1

timber info "Checking changeset status..."

mkdir -p .tmp
statusFile=".tmp/$(cat /proc/sys/kernel/random/uuid)"
touch "${statusFile}"
npm exec -- changeset status --output="${statusFile}"

counts=$(jq -r "(.releases | length), (.changesets | length)" "${statusFile}")
mapfile -t array <<< "$counts"
releaseCount=${array[0]}
changeCount=${array[1]}

if [ "$releaseCount" -eq 0 ] && [ "$changeCount" -gt 0 ]; then
	timber error "Empty changeset"
	exit 8
fi

if [ "$changeCount" -eq 0 ]; then
	timber debug "No SemVer pending"
	cat <<- EOF >| "$outFile"
	{
	  "release": null,
	  "changes": []
	}
	EOF
	exit 0
fi

timber debug "Pending SemVer"

function transform () {
	cat <<- EOF
	{
	  pkg: .releases[0] | {name: .name, type: .type, oldVersion: .oldVersion, newVersion: .newVersion},
	  changes: .changesets | map_values({summary: .summary, id: .id})
	}
	EOF
}

jq "$(transform)" "${statusFile}" >| "$outFile"

rm "${statusFile}"
