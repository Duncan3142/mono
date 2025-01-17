// @ts-check

import boundaries, { devDependencies, ElementMode } from "@duncan3142/eslint-config/boundaries"
import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript, { untyped, parser } from "@duncan3142/eslint-config/typescript"
import { ignored } from "@duncan3142/eslint-config/ignored"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import core, { compose, filePatterns, jsExtensions } from "@duncan3142/eslint-config/core"

import svelte from "eslint-plugin-svelte"
import svelteParser from "svelte-eslint-parser"
import globals from "globals"

const boundaryOptions = {
	settings: {
		elements: [
			{ type: "cnfg", pattern: [".*", "*"], mode: ElementMode.Full },
			{ type: "src", pattern: ["src"], mode: ElementMode.Folder },
		],
	},
	rules: {
		elements: [
			{
				from: ["src"],
				allow: ["src"],
			},
		],
		entry: [
			{
				target: ["src"],
				allow: ["index.ts"],
			},
		],
		external: [{ from: ["*"], allow: ["node:*"] }],
	},
	tsConfigs: ["tsconfig.json", ".svelte-kit/tsconfig.json"],
}

export default compose(
	core,
	ignored(),
	base,
	comments,
	typescript({
		parserOptions: {
			project: ["tsconfig.json", ".svelte-kit/tsconfig.json"],
			extraFileExtensions: [".svelte"],
		},
	}),
	untyped({ files: filePatterns(jsExtensions, "svelte") }),
	// boundaries(boundaryOptions),
	// devDependencies,
	promise,
	jsdoc,
	secrets,
	svelte.configs["flat/recommended"],
	{
		files: ["**/*.svelte"],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: "module",
			globals: { ...globals.node, ...globals.browser },
			parser: svelteParser,
			parserOptions: {
				parser,
				parserOptions: {
					project: ["tsconfig.json", ".svelte-kit/tsconfig.json"],
					extraFileExtensions: [".svelte"],
				},
			},
		},
	},
	prettier,
	svelte.configs["flat/prettier"]
)
