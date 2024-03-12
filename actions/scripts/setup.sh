#!/usr/bin/env bash

# shellcheck disable=SC2034

set -u -e

mkdir -p "${LBIN}"

declare -A pids=()

mkdir -p "${MONO_LOGS_ROOT}"

(
	cp "shell/wait.sh" "$LBIN/mono-wait.sh"
) &> "$MONO_LOGS_ROOT/install-mono-wait" &
pids["$!"]='install-mono-wait'

(
	cp "shell/init-repo.sh" "$LBIN/mono-init-repo.sh"
) &> "$MONO_LOGS_ROOT/install-init-repo" &
pids["$!"]='install-init-repo'

(
	cp -r "chalk" "$LBIN/mono-chalk"
	(cd "$LBIN/mono-chalk" && npm ci --omit=dev)
	ln -s "$LBIN/mono-chalk/main.js" "$LBIN/mono-chalk.js"
) &>"$MONO_LOGS_ROOT/install-mono-chalk" &
pids["$!"]='install-mono-chalk'

# shellcheck source=./shell/wait.sh
. shell/wait.sh

if ! mono_wait pids; then
	echo "Install error"
	exit 1
fi

echo "All done"
