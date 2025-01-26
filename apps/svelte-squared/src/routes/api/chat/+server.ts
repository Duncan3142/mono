import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import ask from "$lib/server/ollama"
import { EitherAsync } from "purify-ts/EitherAsync"
import { Left, Right } from "purify-ts/Either"
import { Codec, exactly, nonEmptyList, number, oneOf, string } from "purify-ts/Codec"
import { HTTPError } from "$lib/http"

const messagesCodec = nonEmptyList(
	Codec.interface({
		content: string,
		role: oneOf([exactly("user"), exactly("assistant")]),
		timestamp: number,
	})
)

/**
 * Ask bot
 * @param event - Event
 * @param event.request - Request
 * @returns Response
 */
const POST: RequestHandler = async ({ request }) => {
	return EitherAsync.fromPromise<HTTPError, unknown>(async () =>
		request
			.json()
			.then((data) => Right(data))
			.catch((e) => Left(new HTTPError(400, "Invalid form data", e)))
	)
		.chain(async (data) => {
			return EitherAsync.liftEither(
				messagesCodec.decode(data).mapLeft((error) => new HTTPError(400, error))
			).chain((messages) => {
				return ask({
					messages,
				})
					.then(({ message: { content, role } }) =>
						Right([...messages, { content, role, timestamp: Date.now() }])
					)
					.catch((e) => Left(new HTTPError(500, "Failed to get response", e)))
			})
		})
		.run()
		.then((result) =>
			result
				.mapLeft(({ code, message }) => error(code, message))
				.map((result) => json(result))
				.extract()
		)
}

export { POST }
