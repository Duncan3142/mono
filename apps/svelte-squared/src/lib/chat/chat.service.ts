import { Either } from "purify-ts/Either"
import { EitherAsync } from "purify-ts/EitherAsync"
import { marked } from "marked"
import { string } from "purify-ts/Codec"

const USER = "user"
const ASSISTANT = "assistant"
type Role = typeof USER | typeof ASSISTANT

type RawMessageMeta = { role: Role; timestamp: number }
type RawMessage = { content: string } & RawMessageMeta

type RawLog = Array<RawMessage>

const COMMENT = "comment"
const THOUGHT = "thought"
const UNKNOWN = "unknown"
type DialogMode = typeof COMMENT | typeof THOUGHT

type ParsedHTMLContent = {
	mode: DialogMode
	parsed: true
	html: string
}
type UnparsedHTMLContent = {
	mode: DialogMode
	parsed: false
	content: string
	error: Error
}
type UnknownHTMLContent = {
	mode: typeof UNKNOWN
	parsed: false
	content: string
}
type InnerContent = Array<ParsedHTMLContent | UnparsedHTMLContent | UnknownHTMLContent>
type ParsedContent = {
	parsed: true
	contents: InnerContent
}
type UnparsedContent = { parsed: false; content: string; error: Error }
type Content = ParsedContent | UnparsedContent

type Message = (
	| ({
			role: "user"
	  } & Content)
	| ({ role: "assistant" } & ({ fetched: false; error: Error } | ({ fetched: true } & Content)))
) & {
	timestamp: number
}

/**
 * HTML parsed log.
 */
type Log = Array<Message>

type Params = {
	fetch: typeof fetch
}

const ONLY_CHILD = 1
const THINK_NODE_NAME = "THINK"
const TEXT_NODE_NAME = "#text"
type ThinkNode = ChildNode & { childNodes: [Text] }

const isTextNode = (node: ChildNode): node is Text => node.nodeName === TEXT_NODE_NAME

const isThoughtNode = (node: ChildNode): node is ThinkNode => {
	const [child] = node.childNodes
	return (
		node.nodeName === THINK_NODE_NAME &&
		typeof child !== "undefined" &&
		node.childNodes.length === ONLY_CHILD &&
		isTextNode(child)
	)
}

const parseContent = (mode: DialogMode, content: string) =>
	Either.encase(() =>
		marked.parse(content, {
			async: false,
		})
	)
		.map((html) => ({ mode, parsed: true, html }) satisfies ParsedHTMLContent)
		.mapLeft((e) => ({ mode, parsed: false, content, error: e }) satisfies UnparsedHTMLContent)
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

	#parse(content: string): Content {
		return Either.encase(() => this.#parser.parseFromString(content, "text/html"))
			.mapLeft((e) => ({ parsed: false, content, error: e }) satisfies UnparsedContent)
			.map((parsedContent) => {
				const body = parsedContent.querySelector("body")
				if (body === null) {
					return {
						parsed: false,
						content,
						error: new Error("Body not found"),
					} satisfies UnparsedContent
				}
				const contents = body.childNodes
					.values()
					.map((node) => {
						switch (true) {
							case isTextNode(node):
								return parseContent(COMMENT, node.textContent ?? "")
							case isThoughtNode(node): {
								const [text] = node.childNodes
								return parseContent(THOUGHT, text.textContent ?? "")
							}
							default:
								return {
									mode: UNKNOWN,
									parsed: false,
									content,
								} satisfies UnknownHTMLContent
						}
					})
					.toArray()
				return { parsed: true, contents } satisfies ParsedContent
			})
			.extract()
	}

	#logError(error: Error) {
		this.#log.push({ role: "assistant", fetched: false, error, timestamp: Date.now() })
	}

	#logUserMessage(content: string): void {
		const meta = { role: USER, timestamp: Date.now() } satisfies RawMessageMeta
		this.#rawLog.push({ content, ...meta })
		const contents = this.#parse(content)
		this.#log.push({ ...contents, ...meta })
	}

	#logBotMessage(content: string): void {
		const meta = { role: ASSISTANT, timestamp: Date.now() } satisfies RawMessageMeta
		this.#rawLog.push({ content, ...meta })
		const contents = this.#parse(content)
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

			await EitherAsync<Error, unknown>(() =>
				fetch("/api/chat", {
					body: JSON.stringify(this.#rawLog),
					method: "POST",
				}).then((data) => data.json())
			)
				.chain((data) =>
					EitherAsync.liftEither(string.decode(data).mapLeft((e) => new Error(e)))
				)

				.run()
				.then((result) =>
					result
						.ifRight((data) => {
							this.#logBotMessage(data)
						})
						.ifLeft((e) => {
							this.#logError(e)
						})
				)
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

export { Chat }
export type { Log }
export default Chat
