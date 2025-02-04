import { EitherAsync } from "purify-ts/EitherAsync"
import { Left, Right } from "purify-ts/Either"
import never from "$lib/never"

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

interface Content {
	content: string
}

interface HasContent<C extends boolean> {
	readonly hasContent: C
}

interface HasError<E extends boolean> {
	readonly hasError: E
}

interface Errored extends HasError<true> {
	error: Error
}

interface UserMessage
	extends MessageMeta<USER>,
		Content,
		HasContent<boolean>,
		HasError<false> {}

interface Fetched<F extends boolean> {
	fetched: F
}

interface FetchedBotMessage
	extends MessageMeta<ASSISTANT>,
		Fetched<true>,
		Content,
		HasContent<boolean>,
		HasError<false> {}

interface UnfetchedBotMessage
	extends MessageMeta<ASSISTANT>,
		HasContent<false>,
		Fetched<false>,
		Errored {}

type BotMessage = FetchedBotMessage | UnfetchedBotMessage

type Message = UserMessage | BotMessage

/**
 * HTML parsed log.
 */
type Log = Array<Message>

type Params = {
	fetch: typeof fetch
}

function hasContent(this: Content): boolean {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Zero length string
	return this.content.length > 0
}

/**
 * Chat
 */
class Chat {
	readonly #params: Params
	#thinking = $state<boolean>(false)
	readonly #log = $state<Log>([])

	/**
	 * Messages.
	 * @param params - Parameters
	 */
	public constructor(params: Params) {
		this.#params = params
	}

	#logFetchError(error: Error) {
		this.#log.push({
			role: ASSISTANT,
			fetched: false,
			error,
			timestamp: Date.now(),
			hasContent: false,
			hasError: true,
		})
	}

	#logUserMessage(content: string): void {
		this.#log.push({
			role: USER,
			timestamp: Date.now(),
			content,
			hasError: false,
			get hasContent() {
				return hasContent.call(this)
			},
		} satisfies UserMessage)
	}

	async #logBotMessage(body: ReadableStream<Uint8Array>): Promise<void> {
		const message = {
			role: ASSISTANT,
			timestamp: Date.now(),
			content: "",
			hasError: false,
			get hasContent() {
				return hasContent.call(this)
			},
			fetched: true,
		} satisfies FetchedBotMessage
		this.#log.push(message)

		const decoder = new TextDecoder()
		await body.pipeTo(
			new WritableStream({
				write: (chunk) => {
					const text = decoder.decode(chunk)
					message.content += text
					this.#log.pop()
					this.#log.push(message)
				},
			})
		)
	}

	get #logHistory() {
		return this.#log.reduce<Array<{ role: Role; content: string }>>((acc, entry) => {
			switch (true) {
				case entry.role === USER: {
					const { role, content } = entry
					acc.push({ role, content })
					return acc
				}
				case entry.role === ASSISTANT && entry.fetched: {
					const { role, content } = entry
					acc.push({ role, content })
					return acc
				}
				default:
					return never("Unexpected role")
			}
		}, [])
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
					body: JSON.stringify(this.#logHistory),
					method: "POST",
				})
			)
				.chain((response) =>
					EitherAsync.liftEither(
						response.body === null
							? Left(new Error("Invalid bot response"))
							: Right(response.body)
					)
				)
				.ifRight(async (body) => {
					await this.#logBotMessage(body)
				})
				.ifLeft((e) => {
					console.error(e)
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
