#!/usr/bin/env bash

set -ueC
set -o pipefail

exec {stdOutFD}>& 1

echo Running a.sh

( exec {outFD}>& 1 && ./b.sh "/dev/fd/$outFD" >& $stdOutFD ) |
( exec {outFD}>& 1 && ./c.sh /dev/stdin "/dev/fd/$outFD" >& $stdOutFD ) |
./d.sh /dev/stdin
