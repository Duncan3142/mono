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

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config --global --add safe.directory "${GITHUB_WORKSPACE}"

gh auth setup-git

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_info "Auth status:"
	gh auth status
fi

mkdir -p "${GITHUB_WORKSPACE}"

cd "${GITHUB_WORKSPACE}" || exit 1

export CLONE_REMOTE=${CLONE_REMOTE:-origin}

gh repo clone "${GITHUB_REPOSITORY}" . -- --depth 1 --single-branch --branch "${CLONE_BRANCH}" --origin "${CLONE_REMOTE}"

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
	log_info "Local branches:"
	git branch -a

	log_info "Git config:"
	cat ~/.gitconfig
fi

cd "${MONO_WORK_DIR}" || exit 1

if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then

	log_info "Work dir:"
	pwd

	log_info "Work dir files:"
	ls -A
fi
