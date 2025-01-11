type ElementType = string
type ElementPattern = string

const folder = "folder"
const file = "file"
const full = "full"

type ElementMode = {
	folder: typeof folder
	file: typeof file
	full: typeof full
}

const ElementMode: ElementMode = {
	folder,
	file,
	full,
}

/**
 * Element
 */
type Element = {
	type: ElementType
	pattern: ElementPattern
	basePattern?: ElementPattern
}

/**
 * Element array
 */
type Elements = Array<Element>

type ImportKindString = "value" | "type" | "typeof"
type ImportKind = ImportKindString | Array<ImportKindString>

type Rule = {
	from: ElementType
	allow?: Array<ElementType>
	disallow?: Array<ElementType>
	importKind?: ImportKind
}

type Rules = Array<Rule>

type Options = {
	/**
	 * Boundary elements
	 */
	elements: Elements
	/**
	 * Boundary rules
	 */
	rules: Rules
}

export { ElementMode }
export type { Element, Elements, Rules, Options }
