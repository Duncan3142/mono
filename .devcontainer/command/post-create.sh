#! /usr/bin/env bash

set -ueC
set -o pipefail

# Oh My Posh
curl -s https://ohmyposh.dev/install.sh | bash -s
oh-my-posh font install meslo
