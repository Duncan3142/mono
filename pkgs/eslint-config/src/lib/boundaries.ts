// // @ts-expect-error -- Package lacks types
// import boundaries from "eslint-plugin-boundaries"
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
// type Options = {
// settings: {
// 	elements: Elements
// }
// rules: { elements: Rules; entry: Rules<"target">; external: Rules }
// }

// const defaultOptions: Options = {
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
// }

/**
 * Boundaries config
 * @param opts - options
 * @param opts.tsConfigs - tsconfig paths
 * @returns ESLint configs
 */
// const configs = ({
// settings: { elements: elementsSettings },
// rules: { elements: elementsRules, entry: entryRules, external: externalRules },
// }: Options = defaultOptions): Configs =>
// 	compose(
// // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
// boundaries.configs.strict,
// {
// name: "@duncan3142/eslint-config/boundaries",
// settings: {
// "boundaries/elements": elementsSettings,
// "boundaries/dependency-nodes": ["import", "dynamic-import", "require", "export"],
// },
// plugins: {
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
// 	boundaries,
// },
// rules: {

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
// 		},
// 	}
// )

// export { defaultOptions }
// export default configs
// export type { Options }
// eslint-disable-next-line unicorn/no-empty-file -- ::TODO::
