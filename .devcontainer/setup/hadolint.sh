#! /usr/bin/env bash

set -ueC
set -o pipefail

hadolint_version="2.12.0"

wget -O /usr/local/bin/hadolint "https://github.com/hadolint/hadolint/releases/download/v${hadolint_version}/hadolint-Linux-x86_64"

chmod +x /usr/local/bin/hadolint
