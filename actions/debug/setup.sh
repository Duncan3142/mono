#!/usr/bin/env bash

echo "PATH: $PATH"

mkdir -p "$LBIN"

ls -A "$LBIN"

cp "wait.sh" "$LBIN/mono-wait.sh"

cp "temp.sh" "$LBIN/mono-temp.sh"

cp -r "node" "$LBIN/mono-debug"
(cd "$LBIN/mono-debug" && npm ci --omit=dev)
ln -s "$LBIN/mono-debug/main.js" "$LBIN/mono-debug.js"

ls -A "$LBIN"
