#!/bin/sh
set -e

npm run build
mkdir -p .package
npm pack --pack-destination .package
