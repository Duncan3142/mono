#!/bin/sh
set -e

echo Running build...
pnpm run turbo:build
echo Running publish...
pnpm exec changeset publish
git push --follow-tags
