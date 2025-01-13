type ElementType = string
type Pattern = string | Array<string>

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

type Capture = Array<string>

/**
 * Element mode
 */
type ElementMode = ElementModes[keyof ElementModes]

/**
 * Element
 */
type Element = {
	type: ElementType
	pattern: Pattern
	basePattern?: Pattern[number]
	mode?: ElementMode
	capture?: Capture
	baseCapture?: Capture
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

/**
 * Boundary options
 */
type Options = {
	/**
	 * Elements
	 */
	elements: Elements
	rules: Rules
}

export { ElementMode }
export type { Options }
