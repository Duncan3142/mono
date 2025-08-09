import { resolve } from "node:path"
import { includeIgnoreFile } from "@eslint/compat"
import { compose, type Configs, type Paths } from "./core.ts"

const GIT_IGNORE = ".gitignore"
const PRETTIER_IGNORE = ".prettierignore"

const IGNORE_FILES_DEFAULT: Paths = [GIT_IGNORE, PRETTIER_IGNORE]

/**
 * Ignore files options
 */
interface Options {
	readonly ignoreFiles: Paths
}

const defaultOptions: Options = {
	ignoreFiles: IGNORE_FILES_DEFAULT,
}

/**
 * Ignored files
 * @param opts - Options
 * @param opts.ignoreFiles - Ignore files
 * @returns Ignored files config
 */
const config = ({ ignoreFiles = IGNORE_FILES_DEFAULT }: Options = defaultOptions): Configs =>
	compose(
		ignoreFiles.map(
			(path): Configs =>
				compose({ name: `Ignore '${path}' files`, extends: [includeIgnoreFile(resolve(path))] })
		)
	)

export { config, IGNORE_FILES_DEFAULT }
