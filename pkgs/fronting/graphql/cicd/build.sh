#!/usr/bin/env bash

set -ueC
set -o pipefail

mkdir -p .graphql
npm exec -- graphql-inspector introspect './graphql' --write './.graphql/schema.json'
npm run assets
