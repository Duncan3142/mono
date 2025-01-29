import { Either } from "purify-ts/Either"
import { EitherAsync } from "purify-ts/EitherAsync"
import { marked } from "marked"
import { string } from "purify-ts/Codec"
import purify from "dompurify"

const USER = "user"
const ASSISTANT = "assistant"
type Role = typeof USER | typeof ASSISTANT

type RawMessageMeta = { role: Role; timestamp: number }
type RawMessage = { content: string } & RawMessageMeta

type RawLog = Array<RawMessage>

const COMMENT = "comment"
const THOUGHT = "thought"

type DialogMode = typeof COMMENT | typeof THOUGHT

type ParsedContentElement = { parsed: true; html: string }
type UnparsedContentElement = { parsed: false; content: string; error: Error }

type BotContentElement<Mode extends DialogMode> = {
	mode: Mode
} & (ParsedContentElement | UnparsedContentElement)

type BotContentElements =
	| [BotContentElement<typeof THOUGHT>, BotContentElement<typeof COMMENT>]
	| BotContentElement<typeof COMMENT>

type ParsedBotContent = {
	parsed: true
	elements: BotContentElements
}
type UnparsedBotContent = { parsed: false; content: string; error: Error }
type BotContent = ParsedBotContent | UnparsedBotContent

type Message = (
	| ({
			role: typeof USER
	  } & (ParsedContentElement | UnparsedContentElement))
	| ({ role: typeof ASSISTANT } & (
			| { fetched: false; error: Error }
			| ({ fetched: true } & BotContent)
	  ))
) & {
	timestamp: number
}
/**
 * User message.
 */
type UserMessage = { role: typeof USER } & Message
/**
 * Unfetched assistant message.
 */
type UnfetchedMessage = { role: typeof ASSISTANT; fetched: false } & Message
/**
 * Fetched assistant message.
 */
type FetchedMessage = { role: typeof ASSISTANT; fetched: true } & Message

/**
 * HTML parsed log.
 */
type Log = Array<Message>

type Params = {
	fetch: typeof fetch
}

const ONLY_CHILD = 1
const FIRST_CHILD_INDEX = 0
const THINK_NODE_NAME = "THINK"
const TEXT_NODE_NAME = "#text"
type ThinkNode = ChildNode & { childNodes: [Text] }

const isChildNode = (v: ChildNode | undefined): v is ChildNode => typeof v !== "undefined"

const isTextNode = (node: ChildNode): node is Text => node.nodeName === TEXT_NODE_NAME

const isThoughtNode = (node: ChildNode): node is ThinkNode => {
	const [child, ...rest] = node.childNodes
	return (
		node.nodeName === THINK_NODE_NAME &&
		rest.length === ONLY_CHILD &&
		isChildNode(child) &&
		isTextNode(child)
	)
}

const parseContent = (content: string) =>
	Either.encase(() =>
		marked.parse(content, {
			async: false,
		})
	)
		.map(
			(html) => ({ parsed: true, html: purify.sanitize(html) }) satisfies ParsedContentElement
		)
		.mapLeft((e) => ({ parsed: false, content, error: e }) satisfies UnparsedContentElement)
		.extract()

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
			.mapLeft((e) => ({ parsed: false, content, error: e }) satisfies UnparsedBotContent)
			.map((parsedContent) => {
				const body = parsedContent.querySelector("body")
				if (body === null) {
					return {
						parsed: false,
						content,
						error: new Error("Body not found"),
					} satisfies UnparsedBotContent
				}
				const [first, second, ...rest] = body.childNodes
				const EMPTY_ARRAY_LENGTH = 0
				const unexpectedNodes = () =>
					({
						parsed: false,
						content,
						error: new Error("Unexpected nodes"),
					}) satisfies UnparsedBotContent

				switch (true) {
					case rest.length > EMPTY_ARRAY_LENGTH: {
						return unexpectedNodes()
					}
					case !isChildNode(first):
						return {
							parsed: false,
							content,
							error: new Error("No nodes found"),
						} satisfies UnparsedBotContent
					case !isChildNode(second) && isChildNode(first) && isTextNode(first): {
						return {
							parsed: true,
							elements: { ...parseContent(first.textContent ?? ""), mode: COMMENT },
						} satisfies ParsedBotContent
					}
					case isChildNode(first) &&
						isChildNode(second) &&
						isThoughtNode(first) &&
						isTextNode(second): {
						return {
							parsed: true,
							elements: [
								{
									...parseContent(first.childNodes[FIRST_CHILD_INDEX].textContent ?? ""),
									mode: THOUGHT,
								},
								{ ...parseContent(second.textContent ?? ""), mode: COMMENT },
							],
						} satisfies ParsedBotContent
					}
					default: {
						return unexpectedNodes()
					}
				}
			})
			.extract()
	}

	#logError(error: Error) {
		this.#log.push({ role: ASSISTANT, fetched: false, error, timestamp: Date.now() })
	}

	#logUserMessage(content: string): void {
		const meta = { role: USER, timestamp: Date.now() } satisfies RawMessageMeta
		this.#rawLog.push({ content, ...meta })
		const contents = parseContent(content)
		this.#log.push({ ...contents, ...meta })
	}

	#logBotMessage(content: string): void {
		const meta = { role: ASSISTANT, timestamp: Date.now() } satisfies RawMessageMeta
		this.#rawLog.push({ content, ...meta })
		const contents = this.#parseBotContent(content)
		this.#log.push({ fetched: true, ...contents, ...meta })
	}

	/**
	 * Ask a question.
	 * @param content - Message text
	 */
	public async ask(content: string): Promise<void> {
		const { fetch } = this.#params
		this.#thinking = true
		try {
			this.#logUserMessage(content)

			await EitherAsync<Error, Response>(() =>
				fetch("/api/chat", {
					body: JSON.stringify(this.#rawLog),
					method: "POST",
				})
			)
				.chain(async (data) => string.decode(await data.json()).mapLeft((e) => new Error(e)))
				.ifRight((data) => {
					this.#logBotMessage(data)
				})
				.ifLeft((e) => {
					this.#logError(e)
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
export type { Log, UserMessage, UnfetchedMessage, FetchedMessage }
export default Chat
