#!/bin/sh
set -e

npm run turbo:build
for p in $(npm query .workspace | jq '.[].path' -r);
do
  (cd $p; mkdir -p .package; npm pack --pack-destination .package);
done;
