#!/usr/bin/env bash

function clone_repo() {
	git config --global user.name "${GITHUB_ACTOR}"
	git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
	git config --global --add safe.directory "${GITHUB_WORKSPACE}"

	gh auth setup-git

	if [[ $LOG_LEVEL -le $LOG_LEVEL_INFO ]]; then
		log_info "Auth status:"
		gh auth status
	fi

	mkdir -p "${GITHUB_WORKSPACE}"

	cd "${GITHUB_WORKSPACE}" || exit 1

	gh repo clone "${GITHUB_REPOSITORY}" . -- --depth 1 --single-branch --branch "${GITHUB_REF_NAME}"

	if [[ $LOG_LEVEL -le $LOG_LEVEL_INFO ]]; then
		log_info "Local branches:"
		git branch -a

		log_info "Git config:"
		cat ~/.gitconfig
	fi

	cd "${MONO_WORK_DIR}" || exit 1

	if [[ $LOG_LEVEL -le $LOG_LEVEL_INFO ]]; then

		log_info "Work dir:"
		pwd

		log_info "Work dir files:"
		ls -A
	fi
}

export -f clone_repo
