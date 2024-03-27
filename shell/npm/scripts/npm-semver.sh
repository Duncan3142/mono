#!/usr/bin/env bash

set -ueC

timber info "Version package..."
npm exec -- changeset version
