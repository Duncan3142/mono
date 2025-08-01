#! /usr/bin/env bash

set -ueC
set -o pipefail

export VOLTA_HOME="${HOME}/.volta"
echo "Setting up Volta in ${VOLTA_HOME}"
export PATH="${VOLTA_HOME}/bin:${PATH}"

curl https://get.volta.sh | bash
# shellcheck source=/dev/null
volta setup
volta install node@lts
volta install npm@11
