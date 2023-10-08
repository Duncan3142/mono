#!/bin/sh
set -e

npm run clean;
npm exec --ws rm -rf node_modules .turbo package-lock.json
rm -rf node_modules .turbo package-lock.json;
