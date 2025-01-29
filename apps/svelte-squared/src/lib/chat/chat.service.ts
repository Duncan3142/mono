import { Either } from "purify-ts/Either"
import { EitherAsync } from "purify-ts/EitherAsync"
import { marked } from "marked"
import { string } from "purify-ts/Codec"
import purify from "dompurify"

const USER = "user"
/**
 * User role.
 */
type USER = typeof USER
const ASSISTANT = "assistant"
/**
 * Bot role.
 */
type ASSISTANT = typeof ASSISTANT
type Role = USER | ASSISTANT

interface MessageMeta<R extends Role> {
	readonly role: R
	readonly timestamp: number
}

interface RawMessage extends MessageMeta<Role> {
	readonly content: string
}

type RawLog = Array<RawMessage>

const COMMENT = "comment"
type COMMENT = typeof COMMENT
const THOUGHT = "thought"
type THOUGHT = typeof THOUGHT

type DialogMode = typeof COMMENT | typeof THOUGHT

interface HasContent<C extends boolean> {
	readonly hasContent: C
}

interface Parsed<P extends boolean> {
	readonly parsed: P
}

interface ParsedContent extends HasContent<boolean>, Parsed<true> {
	readonly html: string
}

interface UnparsedContent extends HasContent<boolean>, Parsed<false> {
	readonly content: string
	readonly error: Error
}

type BaseContentElement = ParsedContent | UnparsedContent

interface UserMessage extends MessageMeta<USER>, HasContent<boolean> {
	content: BaseContentElement
}

interface BotContentElementMeta<Mode extends DialogMode> {
	readonly mode: Mode
}

interface ParsedBotContentElement<Mode extends DialogMode>
	extends BotContentElementMeta<Mode>,
		ParsedContent {}

interface UnparsedBotContentElement<Mode extends DialogMode>
	extends BotContentElementMeta<Mode>,
		UnparsedContent {}

type BotContentElement<Mode extends DialogMode> =
	| ParsedBotContentElement<Mode>
	| UnparsedBotContentElement<Mode>

type BotContentElements =
	| [BotContentElement<THOUGHT>, BotContentElement<COMMENT>]
	| [BotContentElement<COMMENT>]

interface ParsedBotContent extends HasContent<boolean>, Parsed<true> {
	readonly elements: BotContentElements
}

interface UnparsedBotContent extends HasContent<boolean>, UnparsedContent {}

type BotContent = ParsedBotContent | UnparsedBotContent

interface Fetched<F extends boolean> {
	fetched: F
}

interface ParsedBotMessage extends MessageMeta<ASSISTANT>, Fetched<true>, ParsedBotContent {}

interface UnparsedBotMessage
	extends MessageMeta<ASSISTANT>,
		UnparsedBotContent,
		Fetched<true> {}

interface UnfetchedBotMessage
	extends MessageMeta<ASSISTANT>,
		HasContent<false>,
		Fetched<false> {
	error: Error
}

type FetchedBotMessage = ParsedBotMessage | UnparsedBotMessage

type BotMessage = FetchedBotMessage | UnfetchedBotMessage

type Message = UserMessage | BotMessage

// const f = (m: Message) => {
// 	switch (m.role) {
// 		case USER: {
// 			switch (m.content.parsed) {
// 				case true: {
// 					return m.hasContent
// 				}
// 				case false: {
// 					return m.hasContent
// 				}
// 				default:
// 					return never()
// 			}
// 		}
// 		case ASSISTANT: {
// 			switch (m.fetched) {
// 				case true: {
// 					switch (m.parsed) {
// 						case true: {
// 							return m.contents.map((e) => {
// 								switch (e.parsed) {
// 									case true: {
// 										return m.hasContent && e.hasContent
// 									}
// 									case false: {
// 										return m.hasContent && e.hasContent
// 									}
// 									default:
// 										return never()
// 								}
// 							})
// 						}
// 						case false: {
// 							return m.hasContent
// 						}
// 					}
// 				}
// 				case false: {
// 					return m.hasContent
// 				}
// 				default:
// 					return never()
// 			}
// 		}
// 	}
// }

// f({
// 	role: ASSISTANT,
// 	fetched: false,
// 	error: new Error(),
// 	hasContent: false,
// 	timestamp: 0,
// })

/**
 * HTML parsed log.
 */
type Log = Array<Message>

type Params = {
	fetch: typeof fetch
}

const ONLY_CHILD_COUNT = 1
const FIRST_CHILD_INDEX = 0
const ZERO_LENGTH = 0
const THINK_NODE_NAME = "THINK"
const TEXT_NODE_NAME = "#text"
interface ThinkNode extends Omit<ChildNode, "childNodes"> {
	childNodes: [Text]
}

const isChildNode = (v: ChildNode | undefined): v is ChildNode => typeof v !== "undefined"

const isTextNode = (node: ChildNode): node is Text => node.nodeName === TEXT_NODE_NAME

const isThoughtNode = (node: ChildNode | ThinkNode): node is ThinkNode => {
	const [child, ...rest] = node.childNodes
	return (
		node.nodeName === THINK_NODE_NAME &&
		rest.length === ONLY_CHILD_COUNT &&
		isChildNode(child) &&
		isTextNode(child)
	)
}

const parseContent = (content: string): BaseContentElement =>
	Either.encase(() =>
		marked.parse(content, {
			async: false,
		})
	)
		.map(
			(html) =>
				({
					parsed: true,
					html: purify.sanitize(html).trim(),
					get hasContent() {
						return this.html.length > ZERO_LENGTH
					},
				}) satisfies ParsedContent
		)
		.mapLeft(
			(e) =>
				({
					parsed: false,
					content,
					error: e,
					get hasContent() {
						return this.content.length > ZERO_LENGTH
					},
				}) satisfies UnparsedContent
		)
		.extract()

const parseNodeContent = (node: Text) => {
	const content = (node.textContent ?? "").trim()
	return parseContent(content)
}

/**
 * Chat
 */
class Chat {
	readonly #params: Params
	readonly #parser = new DOMParser()
	#thinking = $state<boolean>(false)
	readonly #rawLog: RawLog = []
	readonly #log = $state<Log>([])

	/**
	 * Messages.
	 * @param params - Parameters
	 */
	public constructor(params: Params) {
		this.#params = params
	}

	#parseBotContent(content: string): BotContent {
		return Either.encase(() => this.#parser.parseFromString(content, "text/html"))
			.mapLeft(
				(e) =>
					({
						parsed: false,
						content,
						error: e,
						get hasContent() {
							return this.content.length > ZERO_LENGTH
						},
					}) satisfies UnparsedBotContent
			)
			.map((parsedContent) => {
				const body = parsedContent.querySelector("body")
				const unparsedNodes = (message: string) =>
					({
						parsed: false,
						content,
						error: new Error(message),
						get hasContent() {
							return this.content.length > ZERO_LENGTH
						},
					}) satisfies UnparsedBotContent
				if (body === null) {
					return unparsedNodes("Body not found")
				}
				const [first, second, ...rest] = body.childNodes
				const EMPTY_ARRAY_LENGTH = 0
				switch (true) {
					case rest.length > EMPTY_ARRAY_LENGTH: {
						return unparsedNodes("Unexpected nodes")
					}
					case !isChildNode(first): {
						return unparsedNodes("No nodes found")
					}
					case !isChildNode(second) && isChildNode(first) && isTextNode(first): {
						const elements = [
							{ ...parseNodeContent(first), mode: COMMENT },
						] satisfies ParsedBotContent["elements"]
						const c = {
							parsed: true,
							elements,
							get hasContent() {
								return elements.every((e) => e.hasContent)
							},
						} satisfies ParsedBotContent
						return c
					}
					case isChildNode(first) &&
						isChildNode(second) &&
						isThoughtNode(first) &&
						isTextNode(second): {
						const elements = [
							{
								...parseNodeContent(first.childNodes[FIRST_CHILD_INDEX]),
								mode: THOUGHT,
							},
							{ ...parseNodeContent(second), mode: COMMENT },
						] satisfies ParsedBotContent["elements"]
						return {
							parsed: true,
							elements,
							get hasContent() {
								return elements.every((e) => e.hasContent)
							},
						} satisfies ParsedBotContent
					}
					default: {
						return unparsedNodes("Unexpected nodes")
					}
				}
			})
			.extract()
	}

	#logFetchError(error: Error) {
		this.#log.push({
			role: ASSISTANT,
			fetched: false,
			error,
			timestamp: Date.now(),
			hasContent: false,
		})
	}

	#logUserMessage(content: string): void {
		const meta = { role: USER, timestamp: Date.now() } satisfies MessageMeta<USER>
		this.#rawLog.push({ content, ...meta })
		const contentElement = parseContent(content)
		this.#log.push({
			...meta,
			content: contentElement,
			get hasContent() {
				return this.content.hasContent
			},
		} satisfies UserMessage)
	}

	#logBotMessage(content: string): void {
		const meta = { role: ASSISTANT, timestamp: Date.now() } satisfies MessageMeta<ASSISTANT>
		this.#rawLog.push({ content, ...meta })
		const botContent = this.#parseBotContent(content)
		this.#log.push({
			...meta,
			...botContent,
			fetched: true,
		} satisfies FetchedBotMessage)
	}

	/**
	 * Ask a question.
	 * @param question - Message text
	 */
	public async ask(question: string): Promise<void> {
		const { fetch } = this.#params
		this.#thinking = true
		try {
			this.#logUserMessage(question.trim())

			await EitherAsync<Error, Response>(() =>
				fetch("/api/chat", {
					body: JSON.stringify(this.#rawLog),
					method: "POST",
				})
			)
				.chain(async (data) => string.decode(await data.json()).mapLeft((e) => new Error(e)))
				.ifRight((content) => {
					this.#logBotMessage(content.trim())
				})
				.ifLeft((e) => {
					this.#logFetchError(e)
				})
				.run()
		} finally {
			this.#thinking = false
		}
	}

	/**
	 * HTML parsed log
	 * @returns Parsed log
	 */
	public get log(): Log {
		return this.#log
	}

	/**
	 * Bot is thinking
	 * @returns Thinking state
	 */
	public get thinking(): boolean {
		return this.#thinking
	}
}

export { Chat, USER, ASSISTANT }
export type { Log, UserMessage }
export default Chat
