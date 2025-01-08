#!/usr/bin/env bash

set -ueC
set -o pipefail

parallel ::: "npm run format 2>&1" "npm run test:eslint 2>&1"
