#!/usr/bin/env bash


if [[ -z "${GITHUB_ACTOR}" ]]; then
	log_error "GITHUB_ACTOR is not set"
	exit 1
fi

if [[ -z "${GITHUB_REPOSITORY}" ]]; then
	log_error "GITHUB_REPOSITORY is not set"
	exit 1
fi

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
	log_error "GITHUB_WORKSPACE is not set"
	exit 1
fi

if [[ -z "${CLONE_BRANCH}" ]]; then
	log_error "CLONE_BRANCH is not set"
	exit 1
fi

if [[ -z "${MONO_WORK_DIR}" ]]; then
	log_error "MONO_WORK_DIR is not set"
	exit 1
fi

export CLONE_REMOTE=${CLONE_REMOTE:-origin}

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
git config --global init.defaultBranch main

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

git init

git remote add "${CLONE_REMOTE}" "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}.git"

gh auth setup-git

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Auth status:"
	gh auth status
fi

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Git config:"
	cat ~/.gitconfig
fi

git fetch "${CLONE_REMOTE}" --depth=1 "refs/heads/${CLONE_BRANCH}:refs/remotes/${CLONE_REMOTE}/${CLONE_BRANCH}"

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_debug "Branches post fetch:"
	git --no-pager branch -a -v -v
fi

log_debug "Checkout clone branch:"
git checkout --progress -b "${CLONE_BRANCH}" "${CLONE_REMOTE}/${CLONE_BRANCH}"

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
