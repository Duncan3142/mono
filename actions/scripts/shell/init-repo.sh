#!/usr/bin/env bash

set -u -e

REMOTE="${REMOTE:-origin}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

log_debug "Init repo:"
git init

git remote add "${REMOTE}" "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}.git"

gh auth setup-git

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Auth status:"
	gh auth status
fi

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Git config:"
	cat ~/.gitconfig
fi

git fetch "${REMOTE}" --depth=1 "refs/heads/${CHECKOUT_BRANCH}:refs/remotes/${REMOTE}/${CHECKOUT_BRANCH}"

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Branches post fetch:"
	git --no-pager branch -a -v -v
fi

log_debug "Checkout clone branch:"
git checkout --progress -b "${CHECKOUT_BRANCH}" "${REMOTE}/${CHECKOUT_BRANCH}"

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Branches post checkout:"
	git --no-pager branch -a -v -v
fi

cd "${MONO_WORK_DIR}" || exit 1

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then

	log_debug "Work dir:"
	pwd

	log_debug "Work dir files:"
	ls -A
fi
