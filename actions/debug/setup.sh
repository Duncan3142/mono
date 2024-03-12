#!/usr/bin/env bash

echo "PATH: $PATH"

cp "wait.sh" "$LBIN/mono-wait.sh"

cp "temp.sh" "$LBIN/mono-temp.sh"

cp -r "node" "$LBIN/mono-debug"
(cd "$LBIN/mono-debug" && npm ci --omit=dev)
ln -s "$LBIN/mono-debug/main.js" "$LBIN/mono-debug.js"
