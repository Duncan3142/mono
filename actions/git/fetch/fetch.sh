#!/usr/bin/env bash

echo "Local refs before"
git branch -a

REF_SPECS=()
while read -r spec; do
		REF_SPECS+=("${spec}")
done < <(echo "${RAW_REF_SPECS}" | jq -r '.[]')

echo "Fetching additional ref specs ${REF_SPECS[*]}"

git fetch "${REMOTE}" --depth="${FETCH_DEPTH}" "${REF_SPECS[@]}" || true

echo "Local refs after"
git branch -a
