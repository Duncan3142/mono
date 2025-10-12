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

const JS_EXT = [".js", ".jsx"] as const
const TS_EXT = [".ts", ".tsx"] as const

interface FileExtensions {
	readonly JS: Patterns
	readonly TS: Patterns
	readonly NODE: Patterns
	readonly JSON: Patterns
	readonly CSS: Patterns
	readonly HTML: Patterns
	readonly JSTS: Patterns
}

const FILE_EXTENSIONS: FileExtensions = {
	JS: JS_EXT,
	TS: TS_EXT,
	NODE: [".node"],
	JSON: [".json", ".jsonc"],
	CSS: [".css"],
	HTML: [".html"],
	JSTS: [...JS_EXT, ...TS_EXT],
}

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
export { compose, config, filePatterns, FILE_EXTENSIONS }
