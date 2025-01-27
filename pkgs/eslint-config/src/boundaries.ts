// // @ts-expect-error -- Package lacks types
// import boundaries from "eslint-plugin-boundaries"
import importX from "eslint-plugin-import-x"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

import { TS_CONFIGS_DEFAULT } from "./typescript.ts"
import { compose, type Configs, type Paths } from "./core.ts"
// import { compose, type Configs, type Paths, type Pattern, type Patterns } from "./core.ts"

// /* -------------------------------------------------------------------------- */
// /*                                  Elements                                  */
// /* -------------------------------------------------------------------------- */

// type ElementType = string
// type Capture = Array<string>

// const Folder = "folder"
// const File = "file"
// const Full = "full"

// type ElementModes = {
// 	Folder: typeof Folder
// 	File: typeof File
// 	Full: typeof Full
// }

// const ElementMode: ElementModes = {
// 	Folder,
// 	File,
// 	Full,
// }

// /**
//  * Element mode
//  */
// type ElementMode = ElementModes[keyof ElementModes]

// /**
//  * Element
//  */
// type Element = {
// 	type: ElementType
// 	pattern: Patterns
// 	basePattern?: Pattern
// 	mode?: ElementMode
// 	capture?: Capture
// 	baseCapture?: Capture
// }

// /**
//  * Element array
//  */
// type Elements = Array<Element>

// /* -------------------------------------------------------------------------- */
// /*                                    Rules                                   */
// /* -------------------------------------------------------------------------- */

// type Matcher = Array<Pattern | [Pattern, Record<Pattern, Pattern>]>
// type ImportKindString = "value" | "type" | "typeof"
// type ImportKind = Array<ImportKindString>

// type OneOrBoth<A, B> = A | B | (A & B)
// type RuleKind = "from" | "target"
// type Rule<Kind extends RuleKind = "from"> = (Kind extends "from"
// 	? { from: Matcher }
// 	: { target: Matcher }) & {
// 	importKind?: ImportKind
// } & OneOrBoth<{ allow: Matcher }, { disallow: Matcher }>

// type Rules<Kind extends RuleKind = "from"> = Array<Rule<Kind>>

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

/**
 * Config array factory options
 */
type Options = {
	// settings: {
	// 	elements: Elements
	// }
	// rules: { elements: Rules; entry: Rules<"target">; external: Rules }
	tsConfigs: Paths
}

const defaultOptions: Options = {
	// settings: {
	// 	elements: [
	// 		{ type: "cnfg", pattern: [".*.js", "*.config.js"], mode: ElementMode.Full },
	// 		{ type: "src", pattern: ["src/*"], mode: ElementMode.Full },
	// 	],
	// },
	// rules: {
	// 	elements: [
	// 		{
	// 			from: ["src"],
	// 			allow: ["src"],
	// 		},
	// 	],
	// 	entry: [
	// 		{
	// 			target: ["src"],
	// 			allow: ["*"],
	// 		},
	// 	],
	// 	external: [{ from: ["*"], allow: ["node:*"] }],
	// },

	tsConfigs: TS_CONFIGS_DEFAULT,
}

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
		importX.flatConfigs.recommended,

		importX.flatConfigs.typescript,
		// // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
		// boundaries.configs.strict,
		{
			name: "@duncan3142/eslint-config/boundaries",
			settings: {
				"import/resolver-next": [
					createTypeScriptImportResolver({ alwaysTryTypes: true, project: tsConfigs }),
					{ node: true },
				],
				// "boundaries/elements": elementsSettings,
				// "boundaries/dependency-nodes": ["import", "dynamic-import", "require", "export"],
			},
			// plugins: {
			// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
			// 	boundaries,
			// },
			rules: {
				"import-x/named": "off", // Covered by Typescript
				"import-x/namespace": "off", // Covered by Typescript
				"import-x/default": "off", // Covered by Typescript
				"import-x/no-named-as-default-member": "off", // Covered by Typescript
				"import-x/no-unresolved": "off", // Covered by Typescript
				"import-x/extensions": "off", // Covered by Typescript
				"import-x/no-default-export": "off",
				"import-x/no-relative-parent-imports": "off", // Investigate further
				"import-x/no-internal-modules": "off", // Investigate further
				"import-x/no-extraneous-dependencies": "off", // Investigate further
				"import-x/no-named-as-default": "error",
				"import-x/prefer-default-export": "error",
				"import-x/no-empty-named-blocks": "error",
				"import-x/no-unassigned-import": "error",
				"import-x/no-anonymous-default-export": "error",
				"import-x/no-cycle": "error",
				"import-x/no-unused-modules": "error",
				"import-x/no-deprecated": "error",
				"import-x/no-self-import": "error",
				"import-x/no-commonjs": "error",
				"import-x/order": "error",
				"import-x/first": "error",
				"import-x/exports-last": "error",
				"import-x/newline-after-import": "error",
				"import-x/no-duplicates": "error",
				"import-x/no-absolute-path": "error",
				"import-x/no-useless-path-segments": "error",
				"import-x/group-exports": "error",
				"import-x/no-mutable-exports": "error",
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

export { defaultOptions }
export default configs
export type { Options }
