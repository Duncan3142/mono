#!/usr/bin/env bash

set -ueC

baseRef=$1
headRef=$2
outPipe=$3

maxDepth=${GIT_MAX_DEPTH:-4096}

depth=0
deepenBy=128

echo "Finding merge base"
until mergeBase=$(git merge-base "${baseRef}" "${headRef}")
do
	if [[ $depth -gt $maxDepth ]]; then
		echo "Fetch depth exceeded ${maxDepth}"
		exit 8
	fi

	echo "Deepening fetch..."
	deepenBy=$((deepenBy * 2))
	(( depth+=deepenBy ))
	git fetch --deepen="${deepenBy}" "${GIT_REMOTE}" "${baseRef}" "${headRef}" || exit 1
done

echo "Merge base found: $mergeBase"
echo "MERGE_BASE=$mergeBase" > "$outPipe"
