import ollama, { type ChatRequest, type Message } from "ollama"

const MODEL = "deepseek-r1:1.5b"

const load = ollama.pull({
	model: MODEL,
	stream: false,
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
type Response = ChatStreamReturnType<Chat>

/**
 * Ask a question
 * @param opts - Options
 * @param opts.messages - Messages to send
 * @returns Chat response
 */
const ask = async ({ messages }: AskOptions): Response => {
	await load

	return ollama.chat({
		model: MODEL,
		messages,
		stream: true,
	})
}

export { load }
export default ask
export type { AskOptions, Response }
