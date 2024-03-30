#!/usr/bin/env elvish

var title = 'Hello Elves!'

echo $title

var json = ( cat './data.json' | from-json )

var has-cmd = { |cmd|
	try {
		which $cmd 2> &1 > /dev/null
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

echo $json[true]

var fn = { |x y &meow=woof|
	put [ $x, $y, $meow ]
}

echo ($fn 1 2 &meow=raar)[2]
