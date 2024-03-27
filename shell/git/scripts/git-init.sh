#!/usr/bin/env bash

set -ueC

branches=()
requiredBranches=()

while (( "$#" )); do
	case $1 in
		-c | --checkout)
			checkoutBranch="$2"
			shift 2
			;;
		-b | --branch)
			branches+=("$2")
			shift 2
			;;
		-B | --required-branch)
			requiredBranches+=("$2")
			shift 2
			;;
		*)
			timber error "Invalid argument: $1"
			exit 1
			;;
	esac
done

gh auth login --with-token <<< "${GHA_TOKEN}"
gh auth setup-git

git config --global user.name "${GIT_ACTOR}"
git config --global user.email "${GIT_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GIT_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GIT_WORKSPACE}"

cd "${GIT_WORKSPACE}"

timber info "Init repo:"
git init

# authHeaderConfigKey="http.${GIT_SERVER_URL}/.extraheader"
# authHeaderConfigValue="AUTHORIZATION: basic $(echo -n "x-access-token:${GHA_TOKEN}" | base64)"

git remote add "${GIT_REMOTE}" "${GIT_SERVER_URL}/${GIT_REPOSITORY}.git"

if timber -l debug; then
	timber debug "Git config:"
	git config --list
fi

git-fetch "$checkoutBranch"
if [[ ${#requiredBranches[@]} -gt 0 ]]; then
	git-fetch "${requiredBranches[@]}"
fi
if [[ ${#branches[@]} -gt 0 ]]; then
	git-fetch "${branches[@]}" || true
fi

timber info "Checkout ${checkoutBranch}:"
git checkout --progress "${checkoutBranch}"

if timber -l debug; then
	timber debug "Refs post checkout"
	git-refs
fi

cd "${MONO_WORK_DIR}"

if timber -l debug; then

	timber debug "Work dir:"
	pwd

	timber debug "Work dir files:"
	tree -a
fi
