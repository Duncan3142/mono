#!/usr/bin/env bash

set -ueC

GIT_REMOTE="${GIT_REMOTE:-origin}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

timber debug "Init repo:"
git init

authHeaderKey="http.${GITHUB_SERVER_URL}/.extraheader"
authHeaderValue="AUTHORIZATION: basic $(base64 "x-access-token:${GITHUB_TOKEN}")"
git config "${authHeaderKey}" "${authHeaderValue}"

git remote add "${GIT_REMOTE}" "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}.git"

if timber -l debug; then
	mono_log debug "Auth status:"
	gh auth status
fi

if timber -l debug; then
	mono_log debug "Git config:"
	cat ~/.gitconfig
fi

git fetch "${GIT_REMOTE}" --depth=1 "refs/heads/${CHECKOUT_BRANCH}:refs/remotes/${GIT_REMOTE}/${CHECKOUT_BRANCH}"

if timber -l debug; then
	mono_log debug "Branches post fetch:"
	git --no-pager branch -a -v -v
fi

timber debug "Checkout clone branch:"
git checkout --progress -b "${CHECKOUT_BRANCH}" "${GIT_REMOTE}/${CHECKOUT_BRANCH}"

if timber -l debug; then
	mono_log debug "Branches post checkout:"
	git --no-pager branch -a -v -v
fi

cd "${MONO_WORK_DIR}" || exit 1

if timber -l debug; then

	mono_log debug "Work dir:"
	pwd

	mono_log debug "Work dir files:"
	ls -A
fi
