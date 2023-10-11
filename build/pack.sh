#!/bin/sh
set -e

pnpm run turbo:build
for p in $(pnpm -r list --depth=-1 --json | jq 'del(.[0]) | .[].path' -r);
do
  (cd $p; mkdir -p .package; npm pack --pack-destination .package);
done;
