#!/usr/bin/env bash

set -ueC

cd "${ACTION_DIR}"

mkdir -p "${LBIN}"
mkdir -p "${LLIB}"

. ./shell/coproc-utils.sh

declare -a pids=()

coproc coshell (
	(
		set -e
		echo Installing shell script...
		cd shell
		while read -r script; do
			cp "$script" "$LBIN/${script%.*}"
		done < <(ls -1)
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
		echo Installing chalk...
		cp -r "chalk" "$LLIB/chalk"
		(cd "$LLIB/chalk" && npm ci --omit=dev)
		ln -s "$LLIB/chalk/main.js" "$LBIN/chalk"
		echo -e "Installed chalk\n"
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
