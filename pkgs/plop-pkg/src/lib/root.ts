import { dirname } from "node:path"
import { findUpSync, findUpStop } from "find-up"
import { readdirSync } from "node:fs"

export const pkgRoot = (cwd: string) => {
	// const PACKAGE_JSON = "package.json"
	const url = new URL(cwd)
	const packageJson = findUpSync(
		(dir) => {
			if (dir === "/") return findUpStop
			const contents = readdirSync(dir, {
				withFileTypes: true,
			})
			return contents.find((file) => file.name === "package.json")?.name
		},
		{
			cwd: url.pathname,
			type: "file",
			allowSymlinks: true,
		}
	)

	if (packageJson === undefined) {
		throw new Error("'package.json' not found, this command must be run within an NPM package")
	}

	return dirname(packageJson)
}

export default pkgRoot
