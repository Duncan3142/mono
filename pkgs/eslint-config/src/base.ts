import eslintjs from "@eslint/js"
import { compose, type Configs } from "./core.ts"

const base: Configs = compose(eslintjs.configs.recommended, {
	name: "@duncan3142/eslint-config/base",
	languageOptions: {
		sourceType: "module",
		ecmaVersion: 2024,
	},
	rules: {
		"default-case": "off",
		radix: "error",
		eqeqeq: "error",
		"no-undefined": "error",
		"object-shorthand": ["error", "always"],
		"consistent-return": "off",
		"arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
		"prefer-arrow-callback": "error",
		"no-underscore-dangle": "off",
		"no-await-in-loop": "error",
		"no-continue": "off",
		"no-nested-ternary": "off",
		"no-restricted-syntax": [
			"error",
			{
				selector: "ForInStatement",
				message:
					"for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
			},
			{
				selector: "LabeledStatement",
				message:
					"Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
			},
			{
				selector: "WithStatement",
				message:
					"`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
			},
		],
	},
})

export default base
