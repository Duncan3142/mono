import ollama, { type ChatRequest, type Message, type PullRequest } from "ollama"

const MODEL = "deepseek-r1:1.5b"

type ChatLoadReturnType<F> = F extends {
	(
		request: PullRequest & {
			stream: true
		}
	): infer R
	(
		request: PullRequest & {
			stream?: false
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Discard
	): any
}
	? R
	: never

type Pull = typeof ollama.pull

/**
 * Chat response stream
 */
type LoadResponse = ChatLoadReturnType<Pull>

const load = ollama.pull({
	model: MODEL,
	stream: true,
})

/**
 * Ask options
 */
type AskOptions = {
	messages: Array<Message>
}

type ChatStreamReturnType<F> = F extends {
	(
		request: ChatRequest & {
			stream: true
		}
	): infer R
	(
		request: ChatRequest & {
			stream?: false
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Discard
	): any
}
	? R
	: never

type Chat = typeof ollama.chat

/**
 * Chat response stream
 */
type AskResponse = ChatStreamReturnType<Chat>

/**
 * Ask a question
 * @param opts - Options
 * @param opts.messages - Messages to send
 * @returns Chat response
 */
const ask = async ({ messages }: AskOptions): AskResponse => {
	await load

	return ollama.chat({
		model: MODEL,
		messages,
		stream: true,
	})
}

const ai = {
	ask,
	load,
}

/**
 * AI client
 */
type AI = typeof ai

export default ai
export type { AI, AskOptions, AskResponse, LoadResponse }
