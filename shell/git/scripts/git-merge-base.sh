#!/usr/bin/env bash

set -ueC
set -o pipefail

baseRef=$1
headRef=$2
outPipe=$3

maxDepth=${GIT_MAX_DEPTH:-4096}

depth=0
deepenBy=128

timber info "Finding merge base"
until mergeBase=$(git merge-base "${baseRef}" "${headRef}")
do
	if [[ $depth -gt $maxDepth ]]; then
		timber error "Fetch depth exceeded ${maxDepth}"
		exit 8
	fi

	timber debug "Deepening fetch..."
	deepenBy=$((deepenBy * 2))
	(( depth+=deepenBy ))
	git fetch --deepen="${deepenBy}" "${GIT_REMOTE}" "${baseRef}" "${headRef}" || exit 1
done

timber info "Merge base found: $mergeBase"
echo -E "MERGE_BASE=$mergeBase" > "$outPipe"
