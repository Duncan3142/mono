import { configsArrFactory } from "@duncan3142/eslint-config"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import ts from "typescript-eslint"

export default ts.config(
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

		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	}
)
