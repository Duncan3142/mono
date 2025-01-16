import { configsArrFactory, parsers } from "@duncan3142/eslint-config"
import svelte from "eslint-plugin-svelte"
import globals from "globals"

export default ts.config(
	...configsArrFactory(),
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
				parser: parsers.typescript,
			},
		},
	}
)
