#!/usr/bin/env bash

set -ueC

fetchRefs=()

for arg in "$@"; do
	case $arg in
		-c=* | --checkout=*)
			checkoutBranch="${arg#*=}"
			fetchRefs+=("${checkoutBranch}")
			shift
			;;
		-c | --checkout)
			checkoutBranch="$2"
			fetchRefs+=("${checkoutBranch}")
			shift
			shift
			;;
		-f=* | --fetch=*)
			ref="${arg#*=}"
			fetchRefs+=("${ref}")
			shift
			;;
		-f | --fetch)
			ref="$2"
			fetchRefs+=("${ref}")
			shift
			shift
			;;
		*)
			timber error "Invalid argument: $1"
			exit 1
			;;
	esac
done

GIT_REMOTE="${GIT_REMOTE:-origin}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

timber debug "Init repo:"
git init

authHeaderConfigKey="http.${GITHUB_SERVER_URL}/.extraheader"
authHeaderConfigValue="AUTHORIZATION: basic $(echo -n "x-access-token:${GITHUB_TOKEN}" | base64)"
git config "${authHeaderConfigKey}" "${authHeaderConfigValue}"

git remote add "${GIT_REMOTE}" "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}.git"

if timber -l debug; then
	timber debug "Git config:"
	cat ~/.gitconfig
fi

git-fetch "${fetchRefs[@]}"

if timber -l debug; then
	timber debug "Branches post fetch:"
	git --no-pager branch -a -v -v
fi

timber debug "Checkout clone branch:"
git checkout --progress -b "${checkoutBranch}" "${GIT_REMOTE}/${checkoutBranch}"

if timber -l debug; then
	timber debug "Branches post checkout:"
	git --no-pager branch -a -v -v
fi

cd "${MONO_WORK_DIR}" || exit 1

if timber -l debug; then

	timber debug "Work dir:"
	pwd

	timber debug "Work dir files:"
	ls -A
fi
