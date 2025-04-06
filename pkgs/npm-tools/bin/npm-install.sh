#!/usr/bin/env bash

set -ueC
set -o pipefail

timber info "Install packages..."
npm ci
