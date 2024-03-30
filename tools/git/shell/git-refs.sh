#!/usr/bin/env bash

set -ueC
set -o pipefail

git --no-pager branch -a -v -v
git --no-pager tag
