#!/usr/bin/env bash

set -ueC
set -o pipefail

timber info "Version package..."
npm exec -- changeset version
