import { resolve } from "node:path"
import { includeIgnoreFile } from "@eslint/compat"
import type { Config, Paths } from "./core.js"

const GIT_IGNORE = ".gitignore"
const PRETTIER_IGNORE = ".prettierignore"

const IGNORE_FILES_DEFAULT: Paths = [GIT_IGNORE, PRETTIER_IGNORE]

/**
 * Ignore files options
 */
type IgnoreOpts = {
	files: Paths
}

/**
 * Ignored files
 * @param opts - Options
 * @param opts.files - Ignore files
 * @returns Ignored files config
 */
const ignored = ({ files }: IgnoreOpts): Array<Config> =>
	files.map((path) => includeIgnoreFile(resolve(path)))

export { ignored, IGNORE_FILES_DEFAULT }
