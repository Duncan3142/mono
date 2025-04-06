#!/usr/bin/env bash

set -ueC
set -o pipefail

mkdir -p .package
npm pack . --pack-destination .package
npm i -g .package/*.tgz
