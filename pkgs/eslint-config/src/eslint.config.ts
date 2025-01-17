import { fileURLToPath } from "node:url"
import eslintjs from "@eslint/js"
import jsdoc from "./jsdoc.js"
import secrets from "./secrets.js"

import tseslint from "typescript-eslint"

// @ts-expect-error -- Package lacks types
import boundaries from "eslint-plugin-boundaries"
// @ts-expect-error -- Package lacks types
import imports from "eslint-plugin-import"
// @ts-expect-error -- Package lacks types
import promise from "eslint-plugin-promise"
// @ts-expect-error -- Package lacks types
// eslint-disable-next-line import/no-internal-modules -- Package lacks sufficient exports
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"

import { type Options as BoundariesOpts, ElementMode } from "./boundaries.js"
import { IGNORE_FILES_DEFAULT, ignored } from "./ignored.js"
import prettier from "./prettier.js"
import {
	composeConfigs,
	filePatterns,
	jsExtensions,
	jstsExtensions,
	type Config,
	type Parser,
	type Paths,
	type Plugin,
} from "./core.js"

/**
 * Manually loaded ESLint plugins
 */
const plugins: Record<string, Plugin> = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
	boundaries,
}

const parsers: Record<string, Parser> = {
	typescript: tseslint.parser,
}

const resolverPath = fileURLToPath(import.meta.resolve("eslint-import-resolver-typescript"))

/**
 * Config array factory options
 */
type ConfigsArrOpts = {
	boundaries?: BoundariesOpts
	ignoreFiles?: Paths
	tsConfigs?: Paths
}

type BaseOpts = Required<Pick<ConfigsArrOpts, "boundaries" | "tsConfigs">>

/**
 * Base config
 * @param opts - Base options
 * @param opts.boundaries - Boundaries opts
 * @param opts.boundaries.settings - Boundaries settings
 * @param opts.boundaries.settings.elements - Boundaries elements settings
 * @param opts.boundaries.rules - Boundaries rules
 * @param opts.boundaries.rules.elements - Boundaries elements rules
 * @param opts.boundaries.rules.entry - Boundaries entry rules
 * @param opts.boundaries.rules.external - Boundaries external rules
 * @param opts.tsConfigs - TypeScript config paths
 * @returns ESLint config
 */
const base = ({
	boundaries: {
		settings: { elements: boundaryElementsSettings },
		rules: {
			elements: boundaryElementsRules,
			entry: boundaryEntryRules,
			external: boundaryExternalRules,
		},
	},
	tsConfigs,
}: BaseOpts): Config => {
	return {
		name: "@duncan3142/eslint-config/base",
		settings: {
			"import/resolver": {
				[resolverPath]: {
					alwaysTryTypes: true,
					project: tsConfigs,
				},
				node: true,
			},
			"boundaries/elements": boundaryElementsSettings,
			"boundaries/dependency-nodes": ["import", "dynamic-import", "require", "export"],
		},
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
		files: filePatterns(jstsExtensions),
		plugins,
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
			"promise/no-return-wrap": ["error", { allowReject: true }],
			"no-secrets/no-secrets": "error",

			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					rules: boundaryElementsRules,
				},
			],
			"boundaries/no-private": ["error", { allowUncles: false }],
			"boundaries/entry-point": ["error", { default: "disallow", rules: boundaryEntryRules }],
			"boundaries/external": ["error", { default: "disallow", rules: boundaryExternalRules }],
		},
	}
}

/**
 * JavaScript only config
 */
const js: Config = {
	...tseslint.configs.disableTypeChecked,
	name: "@duncan3142/eslint-config/js",
	files: filePatterns(jsExtensions),
}

/**
 * Test file config
 */
const test: Config = {
	name: "@duncan3142/eslint-config/test",
	files: filePatterns(`spec.${jstsExtensions}`),
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
	files: [...filePatterns(`config.${jstsExtensions}`), ".prettierrc.js"],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

const TS_CONFIGS = ["tsconfig.json", "tsconfig.*.json"]

/**
 * Config array factory
 * @param opts - Config options
 * @param opts.ignoreFiles - Array of paths to ignore files, e.g. `.gitignore`
 * @param opts.boundaries - Boundaries settings
 * @param opts.tsConfigs - TypeScript config paths
 * @returns Array of ESLint configs
 */
const configsArrFactory = ({
	boundaries: boundaryOpts = {
		settings: {
			elements: [
				{ type: "cnfg", pattern: [".*", "*"], mode: ElementMode.Full },
				{ type: "src", pattern: ["src"], mode: ElementMode.Folder },
			],
		},
		rules: {
			elements: [
				{
					from: ["src"],
					allow: ["src"],
				},
			],
			entry: [
				{
					target: ["src"],
					allow: ["index.ts"],
				},
			],
			external: [{ from: ["*"], allow: ["node:*"] }],
		},
	},
	ignoreFiles = IGNORE_FILES_DEFAULT,
	tsConfigs = TS_CONFIGS,
}: ConfigsArrOpts = {}): Array<Config> =>
	composeConfigs(
		ignored({ files: ignoreFiles }),
		eslintjs.configs.recommended,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		comments.recommended,
		tseslint.configs.strictTypeChecked,
		tseslint.configs.stylisticTypeChecked,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		imports.flatConfigs.recommended,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		imports.flatConfigs.typescript,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		promise.configs["flat/recommended"],
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		boundaries.configs.strict,
		jsdoc,
		secrets,
		base({ boundaries: boundaryOpts, tsConfigs }),
		test,
		cnfg,
		js,
		prettier
	)

export { configsArrFactory, ElementMode, parsers, plugins }

export type { ConfigsArrOpts, BoundariesOpts }
