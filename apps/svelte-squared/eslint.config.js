// @ts-check

import boundaries, {
	ElementMode,
	defaultOptions as boundaryDefaults,
} from "@duncan3142/eslint-config/boundaries"
import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript, { untyped, parser } from "@duncan3142/eslint-config/typescript"
import { ignored } from "@duncan3142/eslint-config/ignored"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import core, { compose, filePatterns, jsExtensions } from "@duncan3142/eslint-config/core"

import * as svelte from "eslint-plugin-svelte"
import * as svelteParser from "svelte-eslint-parser"
import globals from "globals"

/** @import { Config } from '@duncan3142/eslint-config/core' */

/* eslint-disable jsdoc/check-tag-names -- Type required in JS */

const boundaryOptions = {
	...boundaryDefaults,
	settings: {
		elements: [
			{
				type: "cnfg",
				pattern: [".prettierrc.js", "*.config.ts", "*.config.js"],
				mode: ElementMode.Full,
			},
			{ type: "src", pattern: ["src"], mode: ElementMode.Folder },
			{ type: "e2e", pattern: ["e2e"], mode: ElementMode.Folder },
			{
				type: "out",
				pattern: [".svelte-kit/types/**"],
				mode: ElementMode.Full,
			},
		],
	},
	rules: {
		elements: [
			{
				from: ["src"],
				allow: ["src", "out"],
			},
		],
		entry: [
			{
				target: ["src", "cnfg", "out", "e2e"],
				allow: ["**"],
			},
		],
		external: [{ from: ["src", "cnfg", "out", "e2e"], allow: ["**"] }],
	},
}

const parserOptions = {
	projectService: true,
	extraFileExtensions: [".svelte"],
}

/** @type {Config} */
const svelteParserConfig = {
	name: "@duncan3142/svelte-squared/parser",
	files: ["**/*.svelte"],
	languageOptions: {
		parser: svelteParser,
		ecmaVersion: 2024,
		sourceType: "module",
		globals: { ...globals.node, ...globals.browser },
		parserOptions: {
			parser,
			parserOptions,
		},
	},
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

export default compose(
	core,
	ignored(),
	base,
	comments,
	svelteParserConfig,
	typescript({
		parserOptions,
	}),
	untyped({ files: filePatterns(jsExtensions, "svelte") }),
	boundaries(boundaryOptions),
	promise,
	jsdoc,
	secrets,
	svelte.configs["flat/recommended"],
	prettier,
	svelte.configs["flat/prettier"]
)
