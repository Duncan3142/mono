#!/usr/bin/env sh

# cd "${MONO_WORK_DIR}" || exit 1

ls.sh

node "${ACTION_DIR}/main.js" "$@"
