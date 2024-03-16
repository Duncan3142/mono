#!/usr/bin/env bash

set -ueC

cd "${ACTION_DIR}"

mkdir -p "${LBIN}"

. ./shell/coproc.sh

declare -a pids=()

coproc coshell (
	(
		set -e
		echo Installing shell script...
		cd shell
		scripts=()
		while read -r script; do
			scripts+=("$script")
		done < <(ls -1)
		cp \
			"${scripts[@]}" \
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
		volta install node@20
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

await "${cochalk_std[@]}"
await "${coshell_std[@]}"

if ! costatus "${pids[@]}"; then
	echo "Error"
	exit 1
fi

echo "All done"
