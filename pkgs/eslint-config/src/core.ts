import type { ESLint } from "eslint"
import tseslint, { type InfiniteDepthConfigWithExtends } from "typescript-eslint"
import type { FlatConfig, Parser as TSParser } from "@typescript-eslint/utils/ts-eslint"
import { entries as ObjectEntries } from "remeda"

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
 * JavaScript file extension pattern
 */
const jsExtensions: Patterns = [".js", ".jsx"]

/**
 * TypeScript file extension pattern
 */
const tsExtensions: Patterns = [".ts", ".tsx"]

/**
 * Node file extension pattern
 */
const nodeExtensions: Patterns = [".node"]

/**
 * JSON file extension pattern
 */
const jsonExtensions: Patterns = [".json", ".jsonc"]

/**
 * CSS file extension pattern
 */
const cssExtensions: Patterns = [".css"]

/**
 * HTML file extension pattern
 */
const htmlExtensions: Patterns = [".html"]

/**
 * JavaScript / TypeScript file extension pattern
 */
const jstsExtensions: Patterns = [...jsExtensions, ...tsExtensions]

/**
 * Factory function for creating file patterns array
 * @param extensionPatterns - Array of file extension patterns
 * @returns Array of file patterns
 */
const filePatterns = (...extensionPatterns: Patterns): Patterns =>
	extensionPatterns.map((pattern) => `**/*${pattern}`)

const compose: (...configs: Array<InfiniteDepthConfigWithExtends>) => Configs = tseslint.config

const core: Config = {
	name: "@duncan3142/eslint-config/core",
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
}

const LINT_LEVEL = {
	all: 1,
	standard: 0,
} as const

/**
 * Lint level key
 */
type LintLevelKey = keyof typeof LINT_LEVEL

/**
 * Lint level
 */
type LintLevel = (typeof LINT_LEVEL)[LintLevelKey]

const lintLevelMap: ReadonlyMap<string, LintLevel> = new Map(ObjectEntries(LINT_LEVEL))

export type {
	Path,
	Paths,
	Pattern,
	Patterns,
	Config,
	Configs,
	Plugin,
	Parser,
	LintLevel,
	LintLevelKey,
}
export {
	compose,
	filePatterns,
	jstsExtensions,
	jsExtensions,
	tsExtensions,
	nodeExtensions,
	jsonExtensions,
	cssExtensions,
	htmlExtensions,
	LINT_LEVEL,
	lintLevelMap,
}

export default core
