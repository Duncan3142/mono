#!/bin/sh
set -e

pnpm exec changeset version
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
