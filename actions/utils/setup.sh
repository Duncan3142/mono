#!/usr/bin/env bash

set -uC

cd "${ACTION_DIR}" || exit 1

mkdir -p "${LBIN}"

. ./shell/coproc.sh

declare -a pids=()

coproc coshell (
	(
		set -e
		echo Installing shell script...
		cd shell
		cp \
			"coproc.sh" \
			"init-repo.sh" \
			"npm-changes.sh" \
			"npm-publish.sh" \
			"print-env.sh" \
			"semver-branch.sh" \
			"semver-commit.sh" \
			"semver-pr.sh" \
			"timber.sh" \
			"$LBIN/"
		echo -e "Installed shell scripts\n"
	) 2>&1 &
	coexit
)
coshell_std=("${coshell[@]}")
pids+=("${coshell_PID}")

coproc cochalk (
	(
		set -e
		echo Installing mono-chalk...
		cp -r "mono-chalk" "$LBIN/mono-chalk"
		(cd "$LBIN/mono-chalk" && npm ci --omit=dev)
		ln -s "$LBIN/mono-chalk/main.js" "$LBIN/mono-chalk.js"
		echo -e "Installed mono-chalk\n"
	) 2>&1 &
	coexit
)
cochalk_std=("${cochalk[@]}")
pids+=("${cochalk_PID}")

await "${coshell_std[@]}"
await "${cochalk_std[@]}"

if ! costatus "${pids[@]}"; then
	echo "Error"
	exit 1
fi

echo "All done"
