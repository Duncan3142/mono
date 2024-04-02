var has-cmd = { |cmd|
	try {
		which $cmd >/dev/null 2>&1
		put $true
	} catch {
		put $false
	}
}
