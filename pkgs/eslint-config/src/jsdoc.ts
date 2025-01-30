import jsdoc from "eslint-plugin-jsdoc"
import type { Configs } from "./core.ts"

const configs: Configs = [
	jsdoc.configs["flat/recommended-typescript-error"],
	{
		name: "@duncan3142/eslint-config/jsdoc",
		rules: {
			"jsdoc/require-jsdoc": [
				"error",
				{
					publicOnly: true,
					require: {
						ArrowFunctionExpression: true,
						ClassDeclaration: true,
						ClassExpression: true,
						FunctionDeclaration: true,
						FunctionExpression: true,
						MethodDefinition: true,
					},
					contexts: ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"],
				},
			],
			"jsdoc/no-blank-blocks": ["error", { enableFixer: false }],
			"jsdoc/require-asterisk-prefix": "error",
			"jsdoc/require-description": "error",
			"jsdoc/sort-tags": "error",
			"jsdoc/require-hyphen-before-param-description": "error",
			"jsdoc/no-blank-block-descriptions": "error",
			"jsdoc/no-bad-blocks": "error",
			"jsdoc/check-line-alignment": "error",
			"jsdoc/check-indentation": "error",
			"jsdoc/check-syntax": "error",
		},
	},
]

export default configs
