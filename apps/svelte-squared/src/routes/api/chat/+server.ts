import { error } from "@sveltejs/kit"
import { EitherAsync } from "purify-ts/EitherAsync"
import {
	HttpError,
	isHttpError,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
} from "http-errors-enhanced"
import type { RequestHandler } from "./$types"
import ask from "$features/chat/io/ollama"
import { messagesCodec } from "$features/chat/lib/codec/message"

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
		.mapLeft(
			(e: unknown) =>
				new HttpError(BAD_REQUEST, "Invalid body json", e instanceof Error ? e : {})
		)
		.chain((data) =>
			EitherAsync.liftEither(
				messagesCodec.decode(data).mapLeft((message) => new HttpError(BAD_REQUEST, message))
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
				.mapLeft(
					(e: unknown) =>
						new HttpError(
							INTERNAL_SERVER_ERROR,
							"Unable to generate message",
							e instanceof Error ? e : {}
						)
				)
		)
		.run()

	const response = either.extract()

	if (isHttpError(response)) {
		const { message, statusCode } = response
		error(statusCode, message)
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
