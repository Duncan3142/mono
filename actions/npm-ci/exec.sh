#!/usr/bin/env bash

set -ueC

git-init --checkout "${EVENT_BRANCH}"

cd "${MONO_WORK_DIR}"

npm-install

timber info "Run tests..."
./shell/test.sh
