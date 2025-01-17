import { fileURLToPath } from "node:url"
// @ts-expect-error -- Package lacks types
import boundaries from "eslint-plugin-boundaries"
// @ts-expect-error -- Package lacks types
import imports from "eslint-plugin-import"

import { TS_CONFIGS_DEFAULT } from "./typescript.ts"

import {
	compose,
	filePatterns,
	jstsExtensions,
	type Config,
	type Configs,
	type Paths,
	type Pattern,
	type Patterns,
} from "./core.ts"

/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
/* -------------------------------------------------------------------------- */

type ElementType = string
type Capture = Array<string>

const Folder = "folder"
const File = "file"
const Full = "full"

type ElementModes = {
	Folder: typeof Folder
	File: typeof File
	Full: typeof Full
}

const ElementMode: ElementModes = {
	Folder,
	File,
	Full,
}

/**
 * Element mode
 */
type ElementMode = ElementModes[keyof ElementModes]

/**
 * Element
 */
type Element = {
	type: ElementType
	pattern: Patterns
	basePattern?: Patterns
	mode?: ElementMode
	capture?: Capture
	baseCapture?: Capture
}

/**
 * Element array
 */
type Elements = Array<Element>

/* -------------------------------------------------------------------------- */
/*                                    Rules                                   */
/* -------------------------------------------------------------------------- */

type Matcher = Array<Pattern | [Pattern, Record<Pattern, Pattern>]>
type ImportKindString = "value" | "type" | "typeof"
type ImportKind = Array<ImportKindString>

type OneOrBoth<A, B> = A | B | (A & B)
type RuleKind = "from" | "target"
type Rule<Kind extends RuleKind = "from"> = (Kind extends "from"
	? { from: Matcher }
	: { target: Matcher }) & {
	importKind?: ImportKind
} & OneOrBoth<{ allow: Matcher }, { disallow: Matcher }>

type Rules<Kind extends RuleKind = "from"> = Array<Rule<Kind>>

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

/**
 * Config array factory options
 */
type Options = {
	settings: { elements: Elements }
	rules: { elements: Rules; entry: Rules<"target">; external: Rules }
	tsConfigs: Paths
}

const defaultOptions: Options = {
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

	tsConfigs: TS_CONFIGS_DEFAULT,
}

const resolverPath = fileURLToPath(import.meta.resolve("eslint-import-resolver-typescript"))

/**
 * Boundaries config
 * @param opts - options
 * @param opts.settings - settings
 * @param opts.settings.elements -element settings
 * @param opts.rules - rules
 * @param opts.rules.elements - element rules
 * @param opts.rules.entry - entry rules
 * @param opts.rules.external - external rules
 * @param opts.tsConfigs - tsconfig paths
 * @returns ESLint configs
 */
const configs = ({
	settings: { elements: elementsSettings },
	rules: { elements: elementsRules, entry: entryRules, external: externalRules },
	tsConfigs,
}: Options = defaultOptions): Configs =>
	compose([
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		imports.flatConfigs.recommended,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		imports.flatConfigs.typescript,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		boundaries.configs.strict,
		{
			name: "@duncan3142/eslint-config/boundaries",
			settings: {
				"import/resolver": {
					[resolverPath]: {
						alwaysTryTypes: true,
						project: tsConfigs,
					},
					node: true,
				},
				"boundaries/elements": elementsSettings,
				"boundaries/dependency-nodes": ["import", "dynamic-import", "require", "export"],
			},
			plugins: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
				boundaries,
			},
			rules: {
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
				"boundaries/element-types": [
					"error",
					{
						default: "disallow",
						rules: elementsRules,
					},
				],
				"boundaries/no-private": ["error", { allowUncles: false }],
				"boundaries/entry-point": ["error", { default: "disallow", rules: entryRules }],
				"boundaries/external": ["error", { default: "disallow", rules: externalRules }],
			},
		},
	])

const devDependencies: Config = {
	name: "@duncan3142/eslint-config/boundaries/dev-dependencies",
	files: [
		...filePatterns(`spec.${jstsExtensions}`, `config.${jstsExtensions}`),
		".prettierrc.js",
	],
	rules: {
		// Allow build / test files to load dev deps
		"import/no-extraneous-dependencies": "off",
	},
}

export { ElementMode, defaultOptions, devDependencies }
export default configs
export type { Options }
