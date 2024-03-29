#!/usr/bin/env bash

set -ueC
set -o pipefail

mkisofs -output seed.iso -volid cidata -joliet -rock user-data meta-data
