import tseslint from "typescript-eslint"
import importX from "./import-x.ts"
import {
	compose,
	filePatterns,
	jsExtensions,
	jstsExtensions,
	type Configs,
	type Parser,
} from "#core"

const parser: Parser = tseslint.parser

/**
 * TypeScript ESLint config
 * @returns ESLint config
 */
const configs = (): Configs =>
	compose(
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
				"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
				"@typescript-eslint/no-non-null-assertion": "off",
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
				"@typescript-eslint/explicit-module-boundary-types": "error",
				"@typescript-eslint/switch-exhaustiveness-check": [
					"error",
					{
						considerDefaultExhaustiveForUnions: true,
						requireDefaultForNonUnion: true,
					},
				],
				"@typescript-eslint/array-type": ["error", { default: "generic" }],
				"@typescript-eslint/no-use-before-define": ["error"],
				"@typescript-eslint/no-import-type-side-effects": "error",
				"@typescript-eslint/no-loop-func": "error",
				"@typescript-eslint/no-magic-numbers": [
					"error",
					{
						ignoreNumericLiteralTypes: true,
					},
				],
				"@typescript-eslint/no-shadow": "error",
				"@typescript-eslint/prefer-readonly": "error",
				"@typescript-eslint/no-unsafe-type-assertion": "error",
				"@typescript-eslint/ban-ts-comment": [
					"error",
					{
						"ts-expect-error": "allow-with-description",
						"ts-nocheck": "allow-with-description",
					},
				],
				"@typescript-eslint/require-array-sort-compare": "error",
				"@typescript-eslint/strict-boolean-expressions": [
					"error",
					{
						allowAny: false,
						allowNullableBoolean: false,
						allowNullableEnum: false,
						allowNullableNumber: false,
						allowNullableObject: false,
						allowNullableString: false,
						allowNumber: false,
						allowString: false,
					},
				],
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
		},
		{
			name: "@duncan3142/eslint-config/typescipt/untyped",
			files: filePatterns(jsExtensions),
			extends: [tseslint.configs.disableTypeChecked],
			rules: {
				"@typescript-eslint/explicit-module-boundary-types": "off",
			},
		},
		importX()
	)

export default configs
