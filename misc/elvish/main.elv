#!/usr/bin/env elvish

use str
use ./lib/cmd meow

var title = 'Hello Elves!'

echo $title

if ( $meow:has-cmd elvish ) {
	echo 'Elvish is installed'
} else {
	echo 'Elvish is not installed'
}

if ( $meow:has-cmd fish ) {
	echo 'Fish is installed'
} else {
	echo 'Fish is not installed'
}

var json = ( cat './data.json' | from-json )

echo $json[object]

var fn = { |x y &meow=woof|
	put [ $x $y $meow ]
}

echo ($fn 1 2 &meow=raar)

echo ( $meow:has-cmd bash )

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
