import { resolve } from "node:path"
import eslintjs from "@eslint/js"
import type { ESLint } from "eslint"
import { includeIgnoreFile } from "@eslint/compat"
import prettier from "eslint-config-prettier"
import jsdoc from "eslint-plugin-jsdoc"
import noSecrets from "eslint-plugin-no-secrets"
import tseslint from "typescript-eslint"
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint"

// @ts-expect-error - module does not have types
import imports from "eslint-plugin-import"
// @ts-expect-error - module does not have types
import promise from "eslint-plugin-promise"
// @ts-expect-error - module does not have types
// eslint-disable-next-line import/no-internal-modules -- Plugin not exported correctly
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"

type Config = FlatConfig.Config
type Plugin = FlatConfig.Plugin | ESLint.Plugin

/**
 * Manually loaded ESLint plugins
 */
const plugins: Record<string, Plugin> = { "no-secrets": noSecrets }

/**
 * File path pattern
 */
type Pattern = string

/**
 * Pattern for explicit ESM / CommonJS file extension qualifier
 */
const mcModuleQualifier: Pattern = "?(m|c)"

/**
 * JavaScript file extension pattern
 */
const jsExtensions: Pattern = `${mcModuleQualifier}js`

/**
 * TypeScript file extension pattern
 */
const tsExtensions: Pattern = `${mcModuleQualifier}ts`

/**
 * JavaScript / TypeScript file extension pattern
 */
const jstsExtensions: Pattern = `${mcModuleQualifier}@(j|t)s`

/**
 * Factory function for creating file patterns array
 * @param extensionPatterns Array of file extension patterns
 * @returns Array of file patterns
 */
const filesArrayFactory = (...extensionPatterns: Array<Pattern>): Array<Pattern> =>
	extensionPatterns.map((pattern) => `**/*.${pattern}`)

/**
 * JavaScript file patterns array
 */
const jsFiles: Array<Pattern> = filesArrayFactory(jsExtensions)

/**
 * TypeScript file patterns array
 */
const tsFiles: Array<Pattern> = filesArrayFactory(tsExtensions)

/**
 * JavaScript / TypeScript file patterns array
 */
const jstsFiles: Array<Pattern> = filesArrayFactory(jstsExtensions)

/**
 * Base config
 */
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
		"import/named": "off",
		"import/namespace": "off",
		"import/default": "off",
		"import/no-named-as-default": "error",
		"import/no-named-as-default-member": "off",
		"import/prefer-default-export": "error",
		"import/no-empty-named-blocks": "error",
		"import/no-default-export": "off",
		"import/no-unassigned-import": "error",
		"import/no-anonymous-default-export": "error",
		"import/extensions": "off",
		"import/no-cycle": "error",
		"import/no-unused-modules": "error",
		"import/no-deprecated": "error",
		"import/no-unresolved": "off",
		"import/no-self-import": "error",
		"import/no-commonjs": "error",
		"import/order": "error",
		"import/first": "error",
		"import/exports-last": "error",
		"import/newline-after-import": "error",
		"import/no-duplicates": "error",
		"import/no-relative-parent-imports": "error",
		"import/no-internal-modules": "error",
		"import/no-absolute-path": "error",
		"import/no-useless-path-segments": "error",
		"import/group-exports": "error",
		"import/no-mutable-exports": "error",
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: false,
				optionalDependencies: false,
				peerDependencies: true,
				bundledDependencies: false,
			},
		],
		"@eslint-community/eslint-comments/require-description": "error",
		"@typescript-eslint/consistent-type-definitions": "off",
		"@typescript-eslint/consistent-return": "error",
		"@typescript-eslint/consistent-type-imports": "error",
		"@typescript-eslint/consistent-type-exports": "error",
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
		"@typescript-eslint/prefer-ts-expect-error": "error",
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
		"promise/no-return-wrap": ["error", { allowReject: true }],
		"no-secrets/no-secrets": "error",
		"jsdoc/require-jsdoc": [
			"error",
			{
				publicOnly: true,
				require: {
					ArrowFunctionExpression: true,
					ClassDeclaration: true,
					FunctionDeclaration: true,
					FunctionExpression: true,
					MethodDefinition: true,
				},
			},
		],
	},
}

/**
 * TypeScript only config
 */
const ts: Config = {
	rules: {},
	name: "@duncan3142/eslint-config/ts",
	files: tsFiles,
}

/**
 * JavaScript only config
 */
const js: Config = {
	...tseslint.configs.disableTypeChecked,
	name: "@duncan3142/eslint-config/js",
	files: jsFiles,
}

/**
 * CommonJS only config
 */
const cjs: Config = {
	name: "@duncan3142/eslint-config/cjs",
	files: filesArrayFactory("cjs"),
	rules: {
		// Allow `require()`
		"@typescript-eslint/no-var-requires": "off",
	},
}

/**
 * Test file config
 */
const test: Config = {
	name: "@duncan3142/eslint-config/test",
	files: filesArrayFactory(`spec.${jstsExtensions}`),
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

/**
 * Cnfg file config
 */
const cnfg: Config = {
	name: "@duncan3142/eslint-config/cnfg",
	files: filesArrayFactory(`config.${jstsExtensions}`),
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

/**
 * Git ignore file name
 */
const GIT_IGNORE = ".gitignore"
/**
 * Prettier ignore file name
 */
const PRETTIER_IGNORE = ".prettierignore"

/**
 * File path
 */
type Path = string

/**
 * Config array factory options
 */
type ConfigsArrOpts = {
	ignoreFiles?: Array<Path>
}

/**
 * Config array factory
 * @param opts Config options
 * @param opts.ignoreFiles Array of paths to ignore files, e.g. `.gitignore`
 * @returns Array of ESLint configs
 */
const configsArrFactory = ({
	ignoreFiles = [GIT_IGNORE, PRETTIER_IGNORE],
}: ConfigsArrOpts = {}): Array<Config> => [
	...ignoreFiles.map((path) => includeIgnoreFile(resolve(path))),
	eslintjs.configs.recommended,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- module lacks types
	comments.recommended as unknown as Config,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- module lacks types
	imports.flatConfigs.recommended as Config,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- module lacks types
	imports.flatConfigs.typescript as Config,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- module lacks types
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

/**
 * Default configs array
 */
const configsArr: Array<Config> = configsArrFactory()

export { configsArr, configsArrFactory, type Path, type ConfigsArrOpts }
export default configsArr
