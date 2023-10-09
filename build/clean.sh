#!/bin/sh
set -e

npm run turbo:clean;
for p in $(npm query .workspace | jq '.[].path' -r);
do
  (cd $p; rm -rf node_modules .turbo);
done;
rm -rf node_modules .turbo package-lock.json;
