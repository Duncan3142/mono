#!/usr/bin/env bash

set -ueC
set -o pipefail

baseRef=$1
headRef=$2
outPipe=$3

maxDepth=${GIT_MAX_DEPTH:-4096}

depth=0
deepenBy=128

function return () {
	case $? in
		0) ;;
		64) ;;
		*) exit 1
	esac
}

trap "return" EXIT

timber info "Finding merge base"
until mergeBase=$(git merge-base "${baseRef}" "${headRef}")
do
	if [[ $depth -gt $maxDepth ]]; then
		timber error "Fetch depth exceeded ${maxDepth}"
		exit 64
	fi

	timber debug "Deepening fetch..."
	deepenBy=$((deepenBy * 2))
	(( depth+=deepenBy ))
	git fetch --deepen="${deepenBy}" "${GIT_REMOTE}" "${baseRef}" "${headRef}"
done

timber info "Merge base found: $mergeBase"
echo -E "MERGE_BASE=$mergeBase" > "$outPipe"
