#!/usr/bin/env bash

# cd "${MONO_WORK_DIR}" || exit 1

cat ~/.gitconfig

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"

cat ~/.gitconfig

gh auth login --with-token "${GITHUB_TOKEN}"

cat ~/.gitconfig

# git config --global user.name "${GITHUB_ACTOR}"
# git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"

ls.sh

node "${ACTION_DIR}/main.js" "$@"
