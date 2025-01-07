import eslintjs from "@eslint/js"
import type { ESLint } from "eslint"
import { includeIgnoreFile } from "@eslint/compat"
import { resolve } from "node:path"
import prettier from "eslint-config-prettier"
// @ts-expect-error
import comments from "@eslint-community/eslint-plugin-eslint-comments"
import tseslint from "typescript-eslint"
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint"
// import * as resolver from "eslint-import-resolver-typescript"
// @ts-expect-error
import imports from "eslint-plugin-import"
// @ts-expect-error
import promise from "eslint-plugin-promise"
import jsdoc from "eslint-plugin-jsdoc"
import nosecrets from "eslint-plugin-no-secrets"

type Config = FlatConfig.Config
type Plugin = FlatConfig.Plugin | ESLint.Plugin

type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>

const plugins: Record<string, Plugin> = {
	"@typescript-eslint": tseslint.plugin,
	"eslint-comments": comments,
	import: imports,
	promise: promise,
	jsdoc,
	"no-secrets": nosecrets,
}

const base: RequiredPick<
	Config,
	| "name"
	| "languageOptions"
	| "files"
	| "rules"
	| "linterOptions"
	| "plugins"
	| "settings"
	| "rules"
> = {
	name: "@duncan3142/eslint-config/base",
	languageOptions: {
		sourceType: "module",
		ecmaVersion: 2024,
		parser: tseslint.parser,
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},

	linterOptions: {
		reportUnusedDisableDirectives: "error",
		noInlineConfig: false,
	},
	files: ["**/*.*(mc)ts", "**/*.*(mc)js"],
	plugins,
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts"],
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
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
		"import/no-unresolved": "error",
		"import/extensions": "off",
		"import/no-cycle": "error",
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
		"@typescript-eslint/no-empty-interface": [
			"error",
			{
				allowSingleExtends: true,
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],
		"promise/no-return-wrap": ["error", { allowReject: true }],
	},
} satisfies Config

const js: RequiredPick<Config, "name" | "files" | "rules"> = {
	name: "@duncan3142/eslint-config/js" as const,
	files: ["*.js", "*.cjs", "*.mjs"],
	rules: {
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
	},
} satisfies Config

const cjs: RequiredPick<Config, "name" | "files" | "rules"> = {
	name: "@duncan3142/eslint-config/cjs",
	files: ["*.cjs"],
	rules: {
		// Allow `require()`
		"@typescript-eslint/no-var-requires": "off",
	},
} satisfies Config

const test: RequiredPick<Config, "name" | "files" | "rules"> = {
	name: "@duncan3142/eslint-config/test",
	files: ["*.spec.*"],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
} satisfies Config

const cnfg: RequiredPick<Config, "name" | "files" | "rules"> = {
	name: "@duncan3142/eslint-config/cnfg",
	files: ["*.config.*"],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
} satisfies Config

type Configs = {
	base: typeof base
	js: typeof js
	cjs: typeof cjs
	test: typeof test
	cnfg: typeof cnfg
}

export const configs: Configs = { base, js, cjs, test, cnfg }

export type Path = string

export type ConfigsArrOpts = {
	ignoreFiles?: Path[]
}

const GIT_IGNORE = ".gitignore"
const PRETTIER_IGNORE = ".prettierignore"

export const configsArrFactory = (opts: ConfigsArrOpts = {}): Config[] => {
	const { ignoreFiles = [GIT_IGNORE, PRETTIER_IGNORE] } = opts
	return [
		...ignoreFiles.map((path) => includeIgnoreFile(resolve(path))),
		eslintjs.configs.recommended,
		comments.configs.recommended,
		imports.flatConfigs.recommended,
		imports.configs.typescript,
		promise.configs["flat/recommended"],
		tseslint.configs.strictTypeChecked,
		tseslint.configs.stylisticTypeChecked,
		base,
		js,
		cjs,
		test,
		cnfg,
		prettier,
	]
}

const configsArr: Config[] = configsArrFactory()

export default configsArr
