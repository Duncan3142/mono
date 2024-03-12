#!/usr/bin/env bash

cp -r "node" "$LBIN/mono-debug"

(cd "$LBIN/mono-debug" && npm ci --omit=dev)

ln -s "$LBIN/mono-debug/main.js" "$LBIN/mono-debug.js"
