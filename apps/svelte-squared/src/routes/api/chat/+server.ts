import { error } from "@sveltejs/kit"
import { EitherAsync } from "purify-ts/EitherAsync"
import type { RequestHandler } from "./$types"
import ask from "$lib/chat/ai"
import { HTTPError, STATUS_400, STATUS_500 } from "$lib/http"
import { messagesCodec } from "$lib/chat/message.codec"

/**
 * Ask bot
 * @param event - Event
 * @param event.request - Request
 * @returns Response
 */
const POST: RequestHandler = async ({ request }) => {
	const either = await EitherAsync<Error, unknown>(() => request.json())
		.ifLeft((e) => {
			console.error(e)
		})
		.mapLeft((e: unknown) => new HTTPError(STATUS_400, "Invalid body json", e))
		.chain((data) =>
			EitherAsync.liftEither(
				messagesCodec.decode(data).mapLeft((message) => new HTTPError(STATUS_400, message))
			)
		)
		.chain((messages) =>
			EitherAsync(() =>
				ask({
					messages,
				})
			)
				.ifLeft((e) => {
					console.error(e)
				})
				.mapLeft((e: unknown) => new HTTPError(STATUS_500, "Unable to generate message", e))
		)
		.run()

	const response = either.extract()

	if (response instanceof Error) {
		const { code, message } = response
		error(code, message)
	}

	const stream = new ReadableStream({
		async pull(controller) {
			for await (const { done, message } of response) {
				if (done) {
					controller.close()
				} else {
					controller.enqueue(message.content)
				}
			}
		},
	})

	return new Response(stream)
}
// eslint-disable-next-line import-x/prefer-default-export -- Support multiple verbs
export { POST }
