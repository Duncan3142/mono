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
type Config = FlatConfig.Config

/**
 * ESLint configs
 */
type Configs = Array<Config>

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
type Patterns = ReadonlyArray<Pattern>

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
const filePatterns = (...extensionPatterns: Patterns): Array<Pattern> =>
	extensionPatterns.map((pattern) => `**/*${pattern}`)

type ConfigWithExtendsArray = ReadonlyArray<InfiniteDepthConfigWithExtends>

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript ESLint does not support readonly config
const compose: (...configs: ConfigWithExtendsArray) => Configs = tseslint.config

const core: Config = {
	name: "@duncan3142/eslint-config/core",
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
}

export type { Path, Paths, Pattern, Patterns as Patterns, Config, Configs, Plugin, Parser }
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
