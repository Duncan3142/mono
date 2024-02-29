#!/bin/sh
set -e

echo Running publish...
pnpm exec changeset publish
git push --follow-tags --no-verify
