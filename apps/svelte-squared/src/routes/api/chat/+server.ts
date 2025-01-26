import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import ask from "$lib/server/ollama"

/**
 * Ask bot
 * @param event - Event
 * @param event.request - Request
 * @returns Response
 */
const POST: RequestHandler = async ({ request }) => {
	const data = await request.json()
	const { message } = data
	if (typeof message !== "string") {
		return error(400, "Invalid message")
	}
	const {
		message: { content, role },
	} = await ask({
		messages: [
			{
				role: "user",
				content: message,
			},
		],
	})

	return json({ content, role })
}

export { POST }
