#!/usr/bin/env elvish

use str
# use epm
# epm:install github.com/Duncan3142/mono

use ./cmd/v1 cmdV1
use ./cmd/v2 cmdV2

var title = 'Hello Elves!'

echo $title

var printInstalled = { |check name|
	if ( $check $name ) {
		echo $name' is installed'
	} else {
		echo $name' is not installed'
	}
}

$printInstalled $cmdV1:has elvish
$printInstalled $cmdV1:has fish

$printInstalled $cmdV2:has elvish
$printInstalled $cmdV2:has fish

var lines = [ ( cat './lines.txt' | from-lines ) ]

echo lines (count $lines) $lines

var upperLines = [ ( each { |x| str:to-upper $x } $lines ) ]

echo upperLines (count $upperLines) $upperLines

var linesCopy = []

for x $lines {
	set linesCopy = [$@linesCopy $x]
}

echo linesCopy (count $linesCopy) $linesCopy

echo done
