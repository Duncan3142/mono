#!/usr/bin/env bash

set -ueC

extraRefs=()
requireRefs=false

while (( "$#" )); do
	case $1 in
		-c | --checkout)
			checkoutBranch="$2"
			shift 2
			;;
		-r | --ref)
			ref="$2"
			extraRefs+=("${ref}")
			shift 2
			;;
		-R | --require-refs)
			requireRefs=true
			shift 1
			;;
		*)
			timber error "Invalid argument: $1"
			exit 1
			;;
	esac
done

git config --global user.name "${GIT_ACTOR}"
git config --global user.email "${GIT_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GIT_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GIT_WORKSPACE}"

cd "${GIT_WORKSPACE}" || exit 1

timber debug "Init repo:"
git init

authHeaderConfigKey="http.${GIT_SERVER_URL}/.extraheader"
authHeaderConfigValue="AUTHORIZATION: basic $(echo -n "x-access-token:${GIT_TOKEN}" | base64)"
git config "${authHeaderConfigKey}" "${authHeaderConfigValue}"

git remote add "${GIT_REMOTE}" "${GIT_SERVER_URL}/${GIT_REPOSITORY}.git"

if timber -l debug; then
	timber debug "Git config:"
	git config --list
fi

git-fetch "$checkoutBranch"
if [[ ${#extraRefs[@]} -gt 0 ]]; then
	git-fetch "${extraRefs[@]}" || [[ $requireRefs != true ]]
fi

timber debug "Checkout ${checkoutBranch}:"
git checkout --progress "${checkoutBranch}"

if timber -l debug; then
	timber debug "Refs post checkout"
	git-branches
fi

cd "${MONO_WORK_DIR}" || exit 1

if timber -l debug; then

	timber debug "Work dir:"
	pwd

	timber debug "Work dir files:"
	ls -A
fi
