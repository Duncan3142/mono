#!/usr/bin/env bash

set -ueC

cd "${ACTION_DIR}"

mkdir -p "${LBIN}"

function await() {
	{
		while read -u "${1}" -r line; do
			echo -E "$line"
		done
	} || true
	echo '' >&"${2}"
}

declare -a pids=()

coproc coshell (
	(
		echo Installing shell script...
		cd shell
		cp \
			"init-repo.sh" \
			"npm-changes.sh" \
			"npm-publish.sh" \
			"print-env.sh" \
			"semver-branch.sh" \
			"semver-commit.sh" \
			"semver-pr.sh" \
			"timber.sh" \
			"$LBIN/"
		echo Installed shell scripts
	) 2>&1 || true # ::TODO:: capture true exit code
	exec >&-
	read -r
)
coshell_std=("${coshell[@]}")
coshell_id=${coshell_PID:?}
pids+=("${coshell_id}")

coproc cochalk (
	(
		echo Installing mono-chalk...
		cp -r "mono-chalk" "$LBIN/mono-chalk"
		(cd "$LBIN/mono-chalk" && npm ci --omit=dev)
		ln -s "$LBIN/mono-chalk/main.js" "$LBIN/mono-chalk.js"
		echo Installed mono-chalk
	) 2>&1 || true # ::TODO:: capture true exit code
	exec >&-
	read -r
)
cochalk_std=("${cochalk[@]}")
cochalk_id=${cochalk_PID:?}
pids+=("${cochalk_id}")

await "${cochalk_std[@]}"
await "${coshell_std[@]}"

for id in "${pids[@]}"; do
	wait "${id}"
	status="$?"
	if [[ $status -ne 0 ]]; then
		echo "Error"
		exit 1
	fi
done

echo "All done"
