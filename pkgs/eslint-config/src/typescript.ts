import tseslint from "typescript-eslint"
import {
	compose,
	filePatterns,
	jsExtensions,
	jstsExtensions,
	type Configs,
	type Parser,
	type Paths,
} from "./core.js"

const TS_CONFIGS_DEFAULT: Paths = ["tsconfig.json", "tsconfig.*.json"]

const parser: Parser = tseslint.parser

const configs: Configs = compose(
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		name: "@duncan3142/eslint-config/typescipt",
		languageOptions: {
			sourceType: "module",
			ecmaVersion: 2024,
			parser,
			parserOptions: {
				projectService: true,
			},
		},
		files: filePatterns(jstsExtensions),
		rules: {
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/consistent-return": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/consistent-type-exports": [
				"error",
				{ fixMixedExportsWithInlineTypeSpecifier: false },
			],
			"@typescript-eslint/explicit-member-accessibility": "error",
			"@typescript-eslint/prefer-destructuring": "error",
			"@typescript-eslint/init-declarations": ["error", "always"],
			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/array-type": ["error", { default: "generic" }],
			"@typescript-eslint/no-use-before-define": ["error"],
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-magic-numbers": "error",
			"@typescript-eslint/no-shadow": "error",
			"@typescript-eslint/prefer-readonly": "error",
			"@typescript-eslint/no-unsafe-type-assertion": "error",
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{ "ts-expect-error": "allow-with-description", "ts-nocheck": "allow-with-description" },
			],
			"@typescript-eslint/promise-function-async": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": "error",
			"@typescript-eslint/no-useless-empty-export": "error",
			"@typescript-eslint/no-empty-object-type": [
				"error",
				{
					allowInterfaces: "with-single-extends",
				},
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
		},
	}
)

type UntypedOptions = {
	files: Paths
}

const defaultUntypedOptions: UntypedOptions = { files: filePatterns(jsExtensions) }

/**
 * Disable typechecking rules
 * @param opts - options
 * @param opts.files - files in which to disable type checked rules
 * @returns ESLint config
 */
const untyped = ({ files }: UntypedOptions = defaultUntypedOptions): Configs =>
	compose({
		files,
		extends: [tseslint.configs.disableTypeChecked],
	})

export { TS_CONFIGS_DEFAULT, parser, untyped, defaultUntypedOptions }
export default configs
