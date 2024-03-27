#!/usr/bin/env bash

set -ueC

export GIT_REMOTE=${GIT_REMOTE:-origin}

git-init --checkout "${EVENT_BRANCH}"

cd "${MONO_WORK_DIR}"

timber info "Install packages..."
npm ci

timber info "Run test..."
./shell/test.sh
