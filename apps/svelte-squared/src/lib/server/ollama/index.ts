import ollama, { type ChatResponse, type Message } from "ollama"

const MODEL = "deepseek-r1:7b"

const pull = ollama.pull({
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
const ask = async ({ messages }: AskOptions): Promise<ChatResponse> => {
	await pull

	return ollama.chat({
		model: MODEL,
		messages,
		stream: false,
	})
}

export { ask }
export type { AskOptions }
export default ask

// ollama pull deepseek-r1:7b
