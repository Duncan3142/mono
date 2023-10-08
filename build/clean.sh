#!/bin/sh
set -e

npm run clean;
rm -rf node_modules .turbo package-lock.json;
