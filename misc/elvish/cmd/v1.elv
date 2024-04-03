var has = { |cmd|
	try {
		which $cmd
		put $true
	} catch {
		put $false
	}
}
