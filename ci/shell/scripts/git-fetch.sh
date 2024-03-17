#!/usr/bin/env bash

set -ueC

GIT_FETCH_DEPTH=${GIT_FETCH_DEPTH:-1}
GIT_REMOTE=${GIT_REMOTE:-origin}

function gitBranches() {
	git branch -a -v -v
}

if timber -l debug; then
	timber debug "Local refs before"
	gitBranches
fi

refSpecs=()
for ref in "$@"; do
	refSpecs+=("refs/heads/${ref}:refs/remotes/${GIT_REMOTE}/${ref}")
done

timber info "Fetching ref specs ${refSpecs[*]}"

git fetch "${GIT_REMOTE}" --depth="${GIT_FETCH_DEPTH}" "${refSpecs[@]}" || true

if timber -l debug; then
	timber debug "Local refs after"
	gitBranches
fi
