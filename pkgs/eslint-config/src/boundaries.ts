import { fileURLToPath } from "node:url"
// // @ts-expect-error -- Package lacks types
// import boundaries from "eslint-plugin-boundaries"
// @ts-expect-error -- Package lacks types
import imports from "eslint-plugin-import"

import { TS_CONFIGS_DEFAULT } from "./typescript.ts"

import { compose, type Configs, type Paths, type Pattern, type Patterns } from "./core.ts"

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
	basePattern?: Pattern
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
	settings: {
		elements: Elements
	}
	rules: { elements: Rules; entry: Rules<"target">; external: Rules }
	tsConfigs: Paths
}

const defaultOptions: Options = {
	settings: {
		elements: [
			{ type: "cnfg", pattern: [".*.js", "*.config.js"], mode: ElementMode.Full },
			{ type: "src", pattern: ["src/*"], mode: ElementMode.Full },
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
				allow: ["*"],
			},
		],
		external: [{ from: ["*"], allow: ["node:*"] }],
	},

	tsConfigs: TS_CONFIGS_DEFAULT,
}

const tsResolverPath = fileURLToPath(import.meta.resolve("eslint-import-resolver-typescript"))

/**
 * Boundaries config
 * @param opts - options
 * @param opts.tsConfigs - tsconfig paths
 * @returns ESLint configs
 */
const configs = ({
	// settings: { elements: elementsSettings },
	// rules: { elements: elementsRules, entry: entryRules, external: externalRules },
	tsConfigs,
}: Options = defaultOptions): Configs =>
	compose(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
		imports.flatConfigs.recommended,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
		imports.flatConfigs.typescript,
		// // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
		// boundaries.configs.strict,
		{
			name: "@duncan3142/eslint-config/boundaries",
			settings: {
				"import/resolver": {
					[tsResolverPath]: {
						alwaysTryTypes: true,
						project: tsConfigs,
					},
					node: true,
				},
				// "boundaries/elements": elementsSettings,
				// "boundaries/dependency-nodes": ["import", "dynamic-import", "require", "export"],
			},
			// plugins: {
			// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
			// 	boundaries,
			// },
			rules: {
				"import/named": "off", // Covered by Typescript
				"import/namespace": "off", // Covered by Typescript
				"import/default": "off", // Covered by Typescript
				"import/no-named-as-default-member": "off", // Covered by Typescript
				"import/no-unresolved": "off", // Covered by Typescript
				"import/extensions": "off", // Covered by Typescript
				"import/no-default-export": "off",
				"import/no-relative-parent-imports": "off", // Investigate further
				"import/no-internal-modules": "off", // Investigate further
				"import/no-extraneous-dependencies": "off", // Investigate further
				"import/no-named-as-default": "error",
				"import/prefer-default-export": "error",
				"import/no-empty-named-blocks": "error",
				"import/no-unassigned-import": "error",
				"import/no-anonymous-default-export": "error",
				"import/no-cycle": "error",
				"import/no-unused-modules": "error",
				"import/no-deprecated": "error",
				"import/no-self-import": "error",
				"import/no-commonjs": "error",
				"import/order": "error",
				"import/first": "error",
				"import/exports-last": "error",
				"import/newline-after-import": "error",
				"import/no-duplicates": "error",
				"import/no-absolute-path": "error",
				"import/no-useless-path-segments": "error",
				"import/group-exports": "error",
				"import/no-mutable-exports": "error",
				// "boundaries/element-types": [
				// 	"error",
				// 	{
				// 		default: "disallow",
				// 		rules: elementsRules,
				// 	},
				// ],
				// "boundaries/no-private": ["error", { allowUncles: false }],
				// "boundaries/entry-point": ["error", { default: "disallow", rules: entryRules }],
				// "boundaries/external": ["error", { default: "disallow", rules: externalRules }],
			},
		}
	)

export { ElementMode, defaultOptions }
export default configs
export type { Options }
