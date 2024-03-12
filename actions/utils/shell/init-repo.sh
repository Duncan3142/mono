#!/usr/bin/env bash

# shellcheck source=./log.sh
. mono-log.sh

set -u -e

REMOTE="${REMOTE:-origin}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

mono_log debug "Init repo:"
git init

git remote add "${REMOTE}" "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}.git"

gh auth setup-git

if mono_log_level debug; then
	mono_log debug "Auth status:"
	gh auth status
fi

if mono_log_level debug; then
	mono_log debug "Git config:"
	cat ~/.gitconfig
fi

git fetch "${REMOTE}" --depth=1 "refs/heads/${CHECKOUT_BRANCH}:refs/remotes/${REMOTE}/${CHECKOUT_BRANCH}"

if mono_log_level debug; then
	mono_log debug "Branches post fetch:"
	git --no-pager branch -a -v -v
fi

mono_log debug "Checkout clone branch:"
git checkout --progress -b "${CHECKOUT_BRANCH}" "${REMOTE}/${CHECKOUT_BRANCH}"

if mono_log_level debug; then
	mono_log debug "Branches post checkout:"
	git --no-pager branch -a -v -v
fi

cd "${MONO_WORK_DIR}" || exit 1

if mono_log_level debug; then

	mono_log debug "Work dir:"
	pwd

	mono_log debug "Work dir files:"
	ls -A
fi
