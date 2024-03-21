#!/usr/bin/env bash

set -ueC

GIT_FETCH_DEPTH=${GIT_FETCH_DEPTH:-1}

refSpecs=()
for ref in "$@"; do
	refSpecs+=("refs/heads/${ref}:refs/remotes/${GIT_REMOTE}/${ref}")
done

if timber -l debug; then
	timber debug "Refs pre fetch"
	git-branches
fi

timber info "Fetching ref specs ${refSpecs[*]}"

git fetch "${GIT_REMOTE}" --depth="${GIT_FETCH_DEPTH}" "${refSpecs[@]}" || true

if timber -l debug; then
	timber debug "Refs post fetch"
	git-branches
fi
