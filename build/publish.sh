#!/bin/sh
set -e

echo Running build...
npm run turbo:build
echo Running publish...
npm exec changeset publish
git push --follow-tags
