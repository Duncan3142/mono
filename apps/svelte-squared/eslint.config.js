// @ts-check

import {
	configsArrFactory,
	ElementMode,
	parsers,
	plugins,
	configBuilder,
} from "@duncan3142/eslint-config"
import svelte from "eslint-plugin-svelte"
import svelteParser from "svelte-eslint-parser"
import globals from "globals"

export default configBuilder(
	...configsArrFactory({
		boundaries: {
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
		},
		tsConfigs: ["tsconfig.json", ".svelte-kit/tsconfig.json"],
	}),
	...svelte.configs["flat/recommended"],
	...svelte.configs["flat/prettier"],
	{
		// files: ["**/*.svelte"],
		plugins,
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: "module",
			globals: { ...globals.node, ...globals.browser },
			parser: svelteParser,
			parserOptions: {
				parser: parsers.typescript,
				parserOptions: {
					project: ["tsconfig.json", ".svelte-kit/tsconfig.json"],
					extraFileExtensions: [".svelte"],
				},
			},
		},
	}
)
