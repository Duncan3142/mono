import jsdoc from "eslint-plugin-jsdoc"
import {
	compose,
	filePatterns,
	jstsExtensions,
	type MutableConfig,
	type MutableConfigs,
} from "./core.ts"

const custom: MutableConfig = {
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

const configs: MutableConfigs = compose({
	name: "@duncan3142/eslint-config/jsdoc",
	files: filePatterns(...jstsExtensions),
	extends: [jsdoc.configs["flat/recommended-typescript-error"], custom],
})

export default configs
