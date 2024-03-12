#!/usr/bin/env bash

echo "MAIN MAIN MAIN MAIN MAIN MAIN"
echo "PATH: ${PATH}"

echo "GIT CONFIG"
git config --list

echo "GLOBAL GIT CONFIG"
cat ~/.gitconfig

echo "LOCAL GIT CONFIG"
cat ./.git/config
