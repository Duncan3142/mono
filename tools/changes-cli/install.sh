#!/usr/bin/env bash

set -ueC
set -o pipefail

echo Installing chalk...
cp -r "chalk" "$LLIB/chalk"
(cd "$LLIB/chalk" && npm ci --omit=dev)
ln -s "$LLIB/chalk/main.js" "$LBIN/chalk"
echo -e "Installed chalk\n"
