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
	}),
	...svelte.configs["flat/recommended"],
	...svelte.configs["flat/prettier"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.svelte"],
		plugins,

		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: parsers.typescript,
				parserOptions: {
					// project: './path/to/your/tsconfig.json',
					projectService: true,
					extraFileExtensions: [".svelte"],
				},
			},
		},
	}
)
