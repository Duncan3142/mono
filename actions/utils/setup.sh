#!/usr/bin/env bash

set -ueC

mkdir -p "${LBIN}"

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
		sleep 8s
		echo Installed shell scripts
	) 2>&1 || true
	echo "Done Shell"
	exec >&-
	read -r
)
coshell_std=("${coshell[@]}") coshell_id=${coshell_ID:?}
pids+=("${coshell_id}")

coproc cochalk (
	(
		echo Installing mono-chalk...
		cp -r "mono-chalk" "$LBIN/mono-chalk"
		(cd "$LBIN/mono-chalk" && npm ci --omit=dev)
		ln -s "$LBIN/mono-chalk/main.js" "$LBIN/mono-chalk.js"
		echo Installed mono-chalk
	) 2>&1 || true
	echo "Done Chalk"
	exec >&-
	read -r
)
cochalk_std=("${cochalk[@]}")  cochalk_id=${cochalk_ID?}
pids+=("${cochalk_id}")

cat "${coshell_std[0]}" && echo '' > "${coshell_std[1]}"
cat "${cochalk_std[0]}" && echo '' > "${cochalk_std[1]}"

for id in "${pids[@]}"; do
	wait "${id}"
	status="$?"
	if [[ $status -ne 0 ]]; then
		echo "Error"
		exit 1
	fi
done

echo "All done"
