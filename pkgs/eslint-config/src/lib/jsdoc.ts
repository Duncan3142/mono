import jsDoc from "eslint-plugin-jsdoc"
import { compose, filePatterns, FILE_EXTENSIONS, type Config, type Configs } from "./core.ts"

const custom: Config = {
	name: "@duncan3142/eslint-config/jsdoc/custom",
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
}

const config: Configs = compose({
	name: "@duncan3142/eslint-config/jsdoc",
	files: filePatterns(...FILE_EXTENSIONS.JSTS),
	extends: [jsDoc.configs["flat/recommended-typescript-error"], custom],
})

export { config }
