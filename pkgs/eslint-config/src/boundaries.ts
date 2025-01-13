type Pattern = string
type Patterns = Array<string>

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

/**
 * Boundary options
 */
type Options = {
	/**
	 * Elements
	 */
	settings: { elements: Elements }
	rules: { elements: Rules; entry: Rules<"target">; external: Rules }
}

export { ElementMode }
export type { Options }
