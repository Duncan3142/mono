#!/usr/bin/env bash

set -ueC

export GIT_REMOTE=${GIT_REMOTE:-origin}

git-init --checkout "${EVENT_BRANCH}"

cd "${MONO_WORK_DIR}"

npm ci

./shell/test.sh
