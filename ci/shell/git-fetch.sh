#!/usr/bin/env bash

rawRefSpecs=$1

FETCH_DEPTH=${FETCH_DEPTH:-1}
GIT_REMOTE=${GIT_REMOTE:-origin}

function gitBranches() {
	git branch -a -v -v
}

if timber.sh -l debug; then
	timber.sh debug "Local refs before"
	gitBranches
fi

refSpecs=()
while read -r spec; do
	refSpecs+=("${spec}")
done < <(echo "${rawRefSpecs}" | jq -r '.[]')

timber.sh info "Fetching additional ref specs ${refSpecs[*]}"

git fetch "${GIT_REMOTE}" --depth="${FETCH_DEPTH}" "${refSpecs[@]}" || true

if timber.sh -l debug; then
	timber.sh debug "Local refs after"
	gitBranches
fi
