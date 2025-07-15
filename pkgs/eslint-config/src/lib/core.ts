import type { ESLint } from "eslint"
import tseslint, { type InfiniteDepthConfigWithExtends } from "typescript-eslint"
import type { FlatConfig, Parser as TSParser } from "@typescript-eslint/utils/ts-eslint"

/**
 * File path
 */
type Path = string

/**
 * Files paths
 */
type Paths = ReadonlyArray<Path>

/**
 * ESLint config
 */
type MutableConfig = FlatConfig.Config

/**
 * ESLint configs
 */
type MutableConfigs = Array<MutableConfig>

/**
 * ESLint plugin
 */
type Plugin = Readonly<FlatConfig.Plugin | ESLint.Plugin>

/**
 * ESLint parser
 */
type Parser = Readonly<TSParser.LooseParserModule>

/**
 * File path pattern
 */
type Pattern = string

/**
 * Patterns array
 */
type MutablePatterns = Array<Pattern>

/**
 * JavaScript file extension pattern
 */
const jsExtensions: MutablePatterns = [".js", ".jsx"]

/**
 * TypeScript file extension pattern
 */
const tsExtensions: MutablePatterns = [".ts", ".tsx"]

/**
 * Node file extension pattern
 */
const nodeExtensions: MutablePatterns = [".node"]

/**
 * JSON file extension pattern
 */
const jsonExtensions: MutablePatterns = [".json", ".jsonc"]

/**
 * CSS file extension pattern
 */
const cssExtensions: MutablePatterns = [".css"]

/**
 * HTML file extension pattern
 */
const htmlExtensions: MutablePatterns = [".html"]

/**
 * JavaScript / TypeScript file extension pattern
 */
const jstsExtensions: MutablePatterns = [...jsExtensions, ...tsExtensions]

/**
 * Factory function for creating file patterns array
 * @param extensionPatterns - Array of file extension patterns
 * @returns Array of file patterns
 */
const filePatterns = (...extensionPatterns: MutablePatterns): MutablePatterns =>
	extensionPatterns.map((pattern) => `**/*${pattern}`)

type MutableConfigWithExtendsArray = Array<InfiniteDepthConfigWithExtends>

const compose: (...configs: MutableConfigWithExtendsArray) => MutableConfigs = tseslint.config

const core: MutableConfig = {
	name: "@duncan3142/eslint-config/core",
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
}

export type {
	Path,
	Paths,
	Pattern,
	MutablePatterns,
	MutableConfig,
	MutableConfigs,
	Plugin,
	Parser,
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
}

export default core
