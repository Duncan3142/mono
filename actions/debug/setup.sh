#!/usr/bin/env bash

echo "PATH: ${PATH}"

echo "GIT CONFIG"
git config --list

echo "GLOBAL GIT CONFIG"
cat ~/.gitconfig

echo "LOCAL GIT CONFIG"
cat "${GITHUB_WORKSPACE}/.git/config"

echo "LOCAL BIN CONTENTS:"
ls -A /usr/local/bin
