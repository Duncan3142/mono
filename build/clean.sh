#!/bin/sh
set -e

npm run turbo:clean;
npm exec --ws rm -rf node_modules .turbo
rm -rf node_modules .turbo package-lock.json;
