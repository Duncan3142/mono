#!/usr/bin/env bash

rawRefSpecs=$1

function gitBranches() {
	git branch -a -v -v
}

if timber -l debug; then
	timber debug "Local refs before"
	gitBranches
fi

refSpecs=()
while read -r spec; do
	refSpecs+=("${spec}")
done < <(echo "${rawRefSpecs}" | jq -r '.[]')

timber info "Fetching additional ref specs ${refSpecs[*]}"

git fetch "${REMOTE}" --depth="${FETCH_DEPTH}" "${refSpecs[@]}" || true

if timber -l debug; then
	timber debug "Local refs after"
	gitBranches
fi
