import eslintjs from "@eslint/js"
import type { ESLint } from "eslint"
import { includeIgnoreFile } from "@eslint/compat"
import { resolve } from "node:path"
import prettier from "eslint-config-prettier"
// @ts-expect-error - module does not have types
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"
import tseslint from "typescript-eslint"
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint"
// @ts-expect-error - module does not have types
import imports from "eslint-plugin-import"
// @ts-expect-error - module does not have types
import promise from "eslint-plugin-promise"
import jsdoc from "eslint-plugin-jsdoc"
import noSecrets from "eslint-plugin-no-secrets"

type Config = FlatConfig.Config
type Plugin = FlatConfig.Plugin | ESLint.Plugin

const plugins: Record<string, Plugin> = {
	// "@typescript-eslint": tseslint.plugin,
	// promise,
	// jsdoc,
	"no-secrets": noSecrets,
}

export type Pattern = string

export const jstsExtensions: Pattern = "?(m|c)@(j|t)s"
export const jstsFiles: Array<Pattern> = [`**/*.${jstsExtensions}`]

const base: Config = {
	name: "@duncan3142/eslint-config/base",
	languageOptions: {
		sourceType: "module",
		ecmaVersion: 2024,
		parser: tseslint.parser,
		parserOptions: {
			projectService: true,
		},
	},
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
	files: [...jstsFiles],
	plugins,
	rules: {
		"default-case": "off",
		"prefer-destructuring": "error",
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
		"import/prefer-default-export": "off",
		"import/no-default-export": "off",
		"import/extensions": "off",
		"import/no-cycle": "error",
		"import/no-unused-modules": "error",
		"import/no-deprecated": "error",
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: false,
				optionalDependencies: false,
				peerDependencies: true,
				bundledDependencies: false,
			},
		],
		"@typescript-eslint/consistent-type-definitions": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-declaration-merging": "off",
		"@typescript-eslint/no-invalid-void-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/prefer-for-of": "off",
		"@typescript-eslint/switch-exhaustiveness-check": "error",
		"@typescript-eslint/array-type": ["error", { default: "generic" }],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-use-before-define": ["error"],
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
		"promise/no-return-wrap": ["error", { allowReject: true }],
		"no-secrets/no-secrets": "error",
	},
}

const js: Config = {
	...tseslint.configs.disableTypeChecked,
	name: "@duncan3142/eslint-config/js",
	files: ["**/*.?(mc)js"],
}

const cjs: Config = {
	name: "@duncan3142/eslint-config/cjs",
	files: ["**/*.cjs"],
	rules: {
		// Allow `require()`
		"@typescript-eslint/no-var-requires": "off",
	},
}

const test: Config = {
	name: "@duncan3142/eslint-config/test",
	files: [`**/*.spec.${jstsExtensions}`],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

const cnfg: Config = {
	name: "@duncan3142/eslint-config/cnfg",
	files: [`**/*.config.${jstsExtensions}`],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

type Configs = {
	base: Config
	js: Config
	cjs: Config
	test: Config
	cnfg: Config
}

export const configs: Configs = { base, js, cjs, test, cnfg }

export type Path = string
export type Qualifiers = string

export type ConfigsArrOpts = {
	ignoreFiles?: Array<Path>
	tsConfig?: Array<Qualifiers>
}

const GIT_IGNORE = ".gitignore"
const PRETTIER_IGNORE = ".prettierignore"

export const configsArrFactory = (opts: ConfigsArrOpts = {}): Array<Config> => {
	const { ignoreFiles = [GIT_IGNORE, PRETTIER_IGNORE] } = opts

	return [
		...ignoreFiles.map((path) => includeIgnoreFile(resolve(path))),
		eslintjs.configs.recommended,
		comments.recommended as Config,
		...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
		imports.flatConfigs.recommended as Config,
		imports.flatConfigs.typescript as Config,
		promise.configs["flat/recommended"] as Config,
		jsdoc.configs["flat/recommended-typescript-error"],
		base,
		test,
		cnfg,
		js,
		cjs,
		prettier,
	]
}

const configsArr: Array<Config> = configsArrFactory()

export default configsArr
