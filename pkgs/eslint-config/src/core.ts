import type { ESLint } from "eslint"
import tseslint, { type InfiniteDepthConfigWithExtends } from "typescript-eslint"

// eslint-disable-next-line import/no-internal-modules -- Package lacks sufficient exports
import type { FlatConfig, Parser as TSParser } from "@typescript-eslint/utils/ts-eslint"

/**
 * File path
 */
type Path = string

/**
 * Files paths
 */
type Paths = Array<Path>

/**
 * ESLint config
 */
type Config = FlatConfig.Config

/**
 * ESLint configs
 */
type Configs = Array<Config>

/**
 * ESLint plugin
 */
type Plugin = FlatConfig.Plugin | ESLint.Plugin

/**
 * ESLint parser
 */
type Parser = TSParser.LooseParserModule

/**
 * File path pattern
 */
type Pattern = string

/**
 * Patterns array
 */
type Patterns = Array<Pattern>

/**
 * Pattern for explicit ESM / CommonJS file extension qualifier
 */
const mcModuleQualifier: Pattern = "?(m|c)"

/**
 * JavaScript file extension pattern
 */
const jsExtensions: Pattern = `${mcModuleQualifier}js`

/**
 * TypeScript file extension pattern
 */
const tsExtensions: Pattern = `${mcModuleQualifier}ts`

/**
 * JavaScript / TypeScript file extension pattern
 */
const jstsExtensions: Pattern = `${mcModuleQualifier}@(j|t)s`

/**
 * Factory function for creating file patterns array
 * @param extensionPatterns - Array of file extension patterns
 * @returns Array of file patterns
 */
const filePatterns = (...extensionPatterns: Patterns): Patterns =>
	extensionPatterns.map((pattern) => `**/*.${pattern}`)

const compose: (...configs: Array<InfiniteDepthConfigWithExtends>) => Configs = tseslint.config

const core: Config = {
	name: "@duncan3142/eslint-config/core",
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
}

export type { Path, Paths, Pattern, Patterns, Config, Configs, Plugin, Parser }
export { compose, filePatterns, jstsExtensions, jsExtensions, tsExtensions }
export default core
