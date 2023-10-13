import { dirname } from "node:path"
import { findUpSync } from "find-up"

export const pkgRoot = (cwd: string) => {
	const packageJson = findUpSync("package.json", { cwd, type: "file" })

	if (packageJson === undefined) {
		throw new Error("'package.json' not found, this command must be run within an NPM package")
	}

	return dirname(packageJson)
}

export default pkgRoot
