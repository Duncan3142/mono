#!/usr/bin/env bash

echo "Finding merge base"
until MERGE_BASE=$(git merge-base "${BASE_REF}" "${HEAD_REF}")
do

	if [[ $DEEPEN -gt $MAX_DEEPEN ]]; then
		echo "Fetch deepen exceeded ${MAX_DEEPEN}"
		exit 1
	fi

	echo "Deepening fetch..."
	DEEPEN=$((DEEPEN * 2))
	git fetch --deepen="${DEEPEN}" "${REMOTE}" "${BASE_REF}" "${HEAD_REF}"
done

echo "Merge base found: $MERGE_BASE"
export MERGE_BASE
