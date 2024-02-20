#!/bin/sh
set -e

pnpm run turbo:clean;
for p in $(pnpm -r list --depth=-1 --json | jq '.[].path' -r);
do
  (cd $p; rm -rf node_modules .turbo pnpm-lock.yaml);
done;
