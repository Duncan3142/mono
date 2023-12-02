#!/bin/sh
set -e

mkisofs -output seed.iso -volid cidata -joliet -rock user-data meta-data
