import { parser, type QualifiedAttribute } from "sax"

type HtmlParentNode = HtmlElement | null

interface HtmlNodeBase {
	/** Unique identifier (for Svelte keyed each blocks) */
	id: string
	/** Parent node (null for root) */
	parent: HtmlParentNode
}

const TEXT = "text"
/**
 * Text node.
 */
type TEXT = typeof TEXT
/**
 * HTML text node.
 */
interface HtmlText extends HtmlNodeBase {
	/** Type tag */
	type: TEXT
	/** Text content */
	text: string
}

type ParsedAttributes = Record<string, string>

interface HtmlElementBase extends HtmlNodeBase {
	/** Element HTML tag name */
	tag: string
	/** Attributes for the element */
	attributes?: ParsedAttributes
}

const ELEMENT = "element"
/**
 * HTML element node.
 */
type ELEMENT = typeof ELEMENT
/**
 * HTML element node.
 */
interface HtmlElement extends HtmlElementBase {
	/** Type tag */
	type: ELEMENT
	/** Element HTML tag name */
	/** Child nodes */
	children: Array<HtmlNode>
}

const VOID_TAG = "void"
/**
 * Void tag.
 */
type VOID_TAG = typeof VOID_TAG
/**
 * HTML self closing tag.
 */
interface HtmlVoidTag extends HtmlElementBase {
	/** Type tag */
	type: VOID_TAG
	selfClosed: boolean
}

/**
 * HTML node.
 */
type HtmlNode = HtmlElement | HtmlVoidTag | HtmlText

/** Callback type called when a node is added or updated */
type HtmlNodeCallback = (node: HtmlNode) => void

type SaxAttributes = Record<string, string> | Record<string, QualifiedAttribute>

class Attributes {
	readonly #attr: SaxAttributes
	public constructor(attr: SaxAttributes) {
		this.#attr = attr
	}
	public parse(): ParsedAttributes {
		const attributes: ParsedAttributes = {}
		for (const [key, value] of Object.entries<SaxAttributes[string]>(this.#attr)) {
			attributes[key] = typeof value === "string" ? value : value.value
		}
		return attributes
	}
}

const VOID_TAGS = [
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]

const BASE_10 = 10

interface HtmlParserEventDetails {
	error: Error
}

interface HtmlParserEvent<Type extends keyof HtmlParserEventDetails>
	extends CustomEvent<HtmlParserEventDetails[Type]> {
	readonly type: Type
}

class CustomHtmlParserEvent<Type extends keyof HtmlParserEventDetails>
	extends CustomEvent<HtmlParserEventDetails[Type]>
	implements HtmlParserEvent<Type>
{
	readonly #type: Type
	public constructor(type: Type, detail: HtmlParserEventDetails[Type]) {
		super(type, { detail })
		this.#type = type
	}
	public override get type(): Type {
		return this.#type
	}
}

const isHtmlParserEvent = <Type extends keyof HtmlParserEventDetails>(
	type: Type,
	event: Event
): event is HtmlParserEvent<Type> =>
	event instanceof CustomHtmlParserEvent && event.type === type

interface HtmlParserEventListenerFunction<Type extends keyof HtmlParserEventDetails>
	extends EventListener {
	(event: HtmlParserEvent<Type>): void
}
interface HtmlParserEventListenerObject<Type extends keyof HtmlParserEventDetails>
	extends EventListenerObject {
	handleEvent: HtmlParserEventListenerFunction<Type>
}

type HtmlParserEventListener<Type extends keyof HtmlParserEventDetails> =
	| HtmlParserEventListenerFunction<Type>
	| HtmlParserEventListenerObject<Type>
	| null

/**
 * Event target
 */
interface HtmlParserEventTarget {
	addEventListener<Type extends keyof HtmlParserEventDetails>(
		type: Type,
		listener: HtmlParserEventListener<Type>
	): void
	dispatchEvent<Type extends keyof HtmlParserEventDetails>(
		event: HtmlParserEvent<Type>
	): boolean
}

interface Opts {
	voidTags: Array<string>
	onError: HtmlParserEventListener<"error">
	root: HtmlElement
}

/**
 * HTML stream parser
 */
class HtmlParser extends EventTarget implements HtmlParserEventTarget {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- initial node count
	#nodeCount = 0
	readonly #parser = parser(true, { lowercase: true, trim: false, normalize: false })
	readonly #root: HtmlElement
	readonly #voidTags: Set<string>
	#current: HtmlParentNode

	/**
	 * HtmlSteamParser constructor
	 * @param opts - options
	 * @param opts.root - initial root node
	 * @param opts.voidTags - self closing tags
	 * @param opts.onError - Error callback
	 */
	public constructor({
		voidTags: voidTags = VOID_TAGS,
		onError,
		root = HtmlParser.root(),
	}: Partial<Opts> = {}) {
		super()
		this.#root = root
		this.#current = this.#root
		if (typeof onError !== "undefined" && onError !== null) {
			this.addEventListener("error", onError)
		}

		this.#voidTags = new Set(voidTags)

		this.#parser.onerror = (error) => {
			this.dispatchEvent(new CustomHtmlParserEvent("error", error))
		}

		this.#parser.onopentag = ({ attributes, isSelfClosing, name }) => {
			if (this.#current === null) {
				const error = new Error(`No parent node at ${this.#parser.position.toString(BASE_10)}`)
				this.dispatchEvent(new CustomHtmlParserEvent("error", error))
				throw error
			}
			const isVoid = isSelfClosing || this.#isVoidTag(name)

			const attr = new Attributes(attributes)

			const base = () => {
				return {
					id: this.#newId(),
					tag: name,
					attributes: attr.parse(),
					parent: this.#current,
				}
			}

			const newNode = isVoid
				? ({
						...base(),
						type: VOID_TAG,
						selfClosed: isSelfClosing,
					} satisfies HtmlVoidTag)
				: ({
						...base(),
						type: ELEMENT,
						children: [],
					} satisfies HtmlElement)

			if (newNode.type === ELEMENT) {
				this.#current = newNode
			} else {
				this.#current.children.push(newNode)
			}
		}

		this.#parser.ontext = (text) => {
			if (this.#current === null) {
				const error = new Error(`No parent node at ${this.#parser.position.toString(BASE_10)}`)
				this.dispatchEvent(new CustomHtmlParserEvent("error", error))
				throw error
			}

			// Create a new text node.
			const textNode: HtmlText = {
				type: TEXT,
				id: this.#newId(),
				text,
				parent: this.#current,
			}
			this.#current.children.push(textNode)
		}

		this.#parser.onclosetag = (name) => {
			const { position: pos } = this.#parser
			const position = pos.toString(BASE_10)
			if (this.#current === null) {
				const error = new Error(`No parent node at ${position}`)
				this.dispatchEvent(new CustomHtmlParserEvent("error", error))
				throw error
			}
			const fromVoid = () => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- last child
				const lastChild = this.#current?.children.at(-1)
				if (typeof lastChild === "undefined") {
					return false
				}
				return lastChild.type === VOID_TAG && lastChild.tag === name && lastChild.selfClosed
			}

			const { tag, parent } = this.#current
			switch (true) {
				case fromVoid(): {
					return
				}
				case tag === name && parent !== null: {
					this.#current = parent
					return
				}
				case tag === name && parent === null: {
					const error = new Error(`Attempting to close orphaned tag at ${position}`)
					this.dispatchEvent(new CustomHtmlParserEvent("error", error))
					throw error
				}
				default: {
					const error = new Error(`Attempting to close unopened or void tag at ${position}`)
					this.dispatchEvent(new CustomHtmlParserEvent("error", error))
					throw error
				}
			}
		}
	}

	/**
	 * Add event listener
	 * @param type - Event type
	 * @param listener - Event listener
	 */
	public override addEventListener<Type extends keyof HtmlParserEventDetails>(
		type: Type,
		listener: HtmlParserEventListener<Type>
	): void {
		super.addEventListener(type, listener)
	}

	/**
	 * Dispatch event
	 * @param event - Event to dispatch
	 * @returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
	 */
	public override dispatchEvent<Type extends keyof HtmlParserEventDetails>(
		event: HtmlParserEvent<Type>
	): boolean {
		return super.dispatchEvent(event)
	}

	/**
	 * New root node
	 * @returns Root node
	 */
	public static root(): HtmlElement {
		return {
			type: ELEMENT,
			tag: "<root>",
			id: "<root>",
			children: [],
			parent: null,
		}
	}

	#isVoidTag(name: string): boolean {
		return this.#voidTags.has(name)
	}

	#newId(): string {
		const id = `node-${this.#nodeCount.toString(BASE_10)}`
		this.#nodeCount += 1
		return id
	}

	/**
	 * Write data to the parser.
	 * @param data - Data to write
	 * @returns this
	 */
	public write(data: string): this {
		this.#parser.write(data)
		return this
	}
	/**
	 * End the stream.
	 */
	public close(): void {
		this.#parser.close()
	}
	/**
	 * Get the root node.
	 * @returns Root node
	 */
	public get root(): HtmlElement {
		return this.#root
	}
	/**
	 * Parser writable stream
	 * @returns Writable stream
	 */
	public stream(): WritableStream {
		return new WritableStream<string>({
			start: (controller) => {
				controller.signal.onabort = () => {
					this.close()
				}
				this.addEventListener("error", (event) => {
					if (isHtmlParserEvent("error", event)) {
						controller.error(event.detail)
					} else {
						controller.error(new Error("Unknown error"))
					}
				})
			},

			write: (chunk) => {
				this.write(chunk)
			},
			abort: () => {
				this.close()
			},
			close: () => {
				this.close()
			},
		})
	}
}

export type { HtmlNode, HtmlNodeCallback }
export { HtmlParser, TEXT, ELEMENT, VOID_TAG }
