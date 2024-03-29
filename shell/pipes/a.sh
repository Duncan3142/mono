#!/usr/bin/env bash

set -ueC
set -o pipefail

exec {outFD}>& 1

(
	exec {dataFDb}>& 1;
	./b.sh "/dev/fd/$dataFDb" >& $outFD;
) | (
	exec {dataFDc}>& 1;
	./c.sh /dev/stdin "/dev/fd/$dataFDc" >& $outFD;
) | (
	./d.sh /dev/stdin
)
