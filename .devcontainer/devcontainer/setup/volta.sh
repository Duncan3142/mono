#! /usr/bin/env bash

set -ueC
set -o pipefail

curl https://get.volta.sh | bash
volta setup
# volta install node@lts
# volta install npm@11
