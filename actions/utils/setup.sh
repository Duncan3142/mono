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
	cp "shell/log.sh" "$LBIN/mono-log.sh"
) &> "$MONO_LOGS_ROOT/install-mono-log" &
pids["$!"]='install-mono-log'

(
	cp "shell/init-repo.sh" "$LBIN/mono-init-repo.sh"
) &> "$MONO_LOGS_ROOT/install-mono-init-repo" &
pids["$!"]='install-mono-init-repo'

(
	cp "shell/debug-env.sh" "$LBIN/mono-debug-env.sh"
) &> "$MONO_LOGS_ROOT/install-mono-debug-env" &
pids["$!"]='install-mono-debug-env'

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
