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

const plugins: Record<string, Plugin> = { "no-secrets": noSecrets }

export type Pattern = string

export const mcModuleQualifier: Pattern = "?(m|c)"
export const jsExtensions: Pattern = `${mcModuleQualifier}js`
export const tsExtensions: Pattern = `${mcModuleQualifier}ts`
export const jstsExtensions: Pattern = `${mcModuleQualifier}@(j|t)s`
export const filesArrayFactory = (...extensionPatterns: Array<Pattern>): Array<Pattern> =>
	extensionPatterns.map((pattern) => `**/*.${pattern}`)

export const jsFiles: Array<Pattern> = filesArrayFactory(jsExtensions)
export const tsFiles: Array<Pattern> = filesArrayFactory(tsExtensions)
export const jstsFiles: Array<Pattern> = filesArrayFactory(jstsExtensions)

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
	files: jstsFiles,
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
		"import/no-unresolved": "off",
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

const ts: Config = {
	rules: {
		"import/no-unresolved": "off",
	},
	name: "@duncan3142/eslint-config/ts",
	files: tsFiles,
}

const js: Config = {
	...tseslint.configs.disableTypeChecked,
	name: "@duncan3142/eslint-config/js",
	files: jsFiles,
}

const cjs: Config = {
	name: "@duncan3142/eslint-config/cjs",
	files: filesArrayFactory("cjs"),
	rules: {
		// Allow `require()`
		"@typescript-eslint/no-var-requires": "off",
	},
}

const test: Config = {
	name: "@duncan3142/eslint-config/test",
	files: filesArrayFactory(`spec.${jstsExtensions}`),
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

const cnfg: Config = {
	name: "@duncan3142/eslint-config/cnfg",
	files: filesArrayFactory(`config.${jstsExtensions}`),
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		comments.recommended as Config,
		...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		imports.flatConfigs.recommended as Config,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		imports.flatConfigs.typescript as Config,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		promise.configs["flat/recommended"] as Config,
		jsdoc.configs["flat/recommended-typescript-error"],
		base,
		test,
		cnfg,
		js,
		cjs,
		ts,
		prettier,
	]
}

const configsArr: Array<Config> = configsArrFactory()

export default configsArr
