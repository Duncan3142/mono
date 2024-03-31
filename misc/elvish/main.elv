#!/usr/bin/env elvish

use str

var title = 'Hello Elves!'

echo $title

var has-cmd = { |cmd|
	try {
		which $cmd >/dev/null 2>&1
		put $true
	} catch {
		put $false
	}
}

if ( $has-cmd elvish ) {
	echo 'Elvish is installed'
} else {
	echo 'Elvish is not installed'
}

if ( $has-cmd fish ) {
	echo 'Fish is installed'
} else {
	echo 'Fish is not installed'
}

var json = ( cat './data.json' | from-json )

echo $json[booleans]

var fn = { |x y &meow=woof|
	put [ $x $y $meow ]
}

echo ($fn 1 2 &meow=raar)[2]

echo ( $has-cmd bash )

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
