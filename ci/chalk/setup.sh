#!/usr/bin/env bash

set -ueC

volta install node@20
echo Installing chalk...
cp -r "chalk" "$LLIB/chalk"
(cd "$LLIB/chalk" && npm ci --omit=dev)
ln -s "$LLIB/chalk/main.js" "$LBIN/chalk"
echo -e "Installed chalk\n"
