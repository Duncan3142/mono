#!/usr/bin/env bash

set -ueC

branches=()
tags=()
while (( "$#" )); do
	case $1 in
		-t | --tag)
			tags=("$2")
			shift 2
			;;
		-d | --depth)
			GIT_FETCH_DEPTH=$2
			shift 2
			;;
		*)
			branches+=("$1")
			shift
			;;
	esac
done

GIT_FETCH_DEPTH=${GIT_FETCH_DEPTH:-1}

refSpecs=()
for branch in "${branches[@]}"; do
	refSpecs+=("refs/heads/${branch}:refs/remotes/${GIT_REMOTE}/${branch}")
done
for tag in "${tags[@]}"; do
	refSpecs+=("refs/tags/${tag}:refs/tags/${tag}")
done

if timber -l debug; then
	timber debug "Refs pre fetch"
	git-refs
fi

timber info "Fetching ref specs ${refSpecs[*]}"

git fetch "${GIT_REMOTE}" --depth="${GIT_FETCH_DEPTH}" "${refSpecs[@]}"

if timber -l debug; then
	timber debug "Refs post fetch"
	git-refs
fi
