#!/bin/sh
set -e

echo Running build...
npm run build
echo Running publish...
npm exec changeset publish
git push --follow-tags
