#!/usr/bin/env bash

GIT_REMOTE="${GIT_REMOTE:-origin}"

baseRef=$1
headRef=$2
OUTPUT=$3

maxDepth=${GIT_MAX_DEEPTH:-1024}

depth=0
deepenBy=2

echo "Finding merge base"
until mergeBase=$(git merge-base "${baseRef}" "${headRef}")
do
	if [[ $depth -gt $maxDepth ]]; then
		echo "Fetch depth exceeded ${maxDepth}"
		exit 1
	fi

	echo "Deepening fetch..."
	deepenBy=$((deepenBy * 2))
	(( depth+=deepenBy ))
	git fetch --deepen="${deepenBy}" "${GIT_REMOTE}" "${baseRef}" "${headRef}"
done

echo "Merge base found: $mergeBase"
echo "MERGE_BASE=$mergeBase" > "$OUTPUT"
