import ollama, { type ChatResponse, type Message } from "ollama"
import type { AbortableAsyncIterator } from "ollama/src/utils.js"

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

/**
 * Ask a question
 * @param opts - Options
 * @param opts.messages - Messages to send
 * @returns Chat response
 */
const ask = async ({ messages }: AskOptions): Promise<AbortableAsyncIterator<ChatResponse>> => {
	await load

	return ollama.chat({
		model: MODEL,
		messages,
		stream: true,
		// format: "json",
	})
}

export { load }
export default ask
export type { AskOptions }
