#!/usr/bin/env sh

if [ -z "$CI" ]
then
  npm exec -- husky
else
  echo "Skipping husky install in CI environment"
fi
