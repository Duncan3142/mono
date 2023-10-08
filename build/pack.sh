#!/bin/sh
set -e

npm run build
npm exec --ws mkdir -p .package
npm pack --ws --pack-destination .package
