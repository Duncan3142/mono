import type { ESLint, Linter } from "eslint"
import { defineConfig } from "eslint/config"

type Path = string

type Paths = ReadonlyArray<Path>

type Config = Linter.Config

type Configs = Array<Config>

type Plugin = ESLint.Plugin

type Parser = Linter.Parser

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

type Compose = typeof defineConfig

const compose: Compose = defineConfig

const config: Config = {
	name: "@duncan3142/eslint-config/core",
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
}

export type { Path, Paths, Pattern, Patterns as Patterns, Config, Configs, Plugin, Parser }
export {
	compose,
	config,
	filePatterns,
	jstsExtensions,
	jsExtensions,
	tsExtensions,
	nodeExtensions,
	jsonExtensions,
	cssExtensions,
	htmlExtensions,
}
