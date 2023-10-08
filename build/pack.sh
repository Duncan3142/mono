#!/bin/sh
set -e

npm run turbo:build
npm exec --ws mkdir -p .package
npm pack --ws --pack-destination .package
