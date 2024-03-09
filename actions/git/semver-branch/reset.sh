#!/usr/bin/env bash

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Resetting ${CURRENT_BRANCH} to ${BASE_BRANCH}"
git reset --hard "${BASE_BRANCH}"
