#!/usr/bin/env bash

set -ueC
set -o pipefail

parallel ::: "npm run format 2>&1" "npm run assets 2>&1"
parallel ::: "npm run lint:eslint:all 2>&1" "npm run test:vitest 2>&1"
