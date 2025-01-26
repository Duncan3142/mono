import { error, type Actions } from "@sveltejs/kit"
import { Codec, string, nonEmptyList, oneOf, exactly, number } from "purify-ts/Codec"
import { Left, Right } from "purify-ts/Either"
import { EitherAsync } from "purify-ts/EitherAsync"
// import type { RequestHandler } from "./$types"
import { ask, type AskOptions } from "$lib/server/ollama"

type ActionError = {
	code: number
	message: string
	cause?: Error
}

const jsonParse = (input: unknown) => {
	if (typeof input === "string") {
		try {
			return Right<unknown>(JSON.parse(input))
		} catch (e) {
			return Left("Invalid JSON string")
		}
	}
	return Left("Expected string for parsing")
}

const jsonString = <T>(codec: Codec<T>) =>
	Codec.custom<T>({
		decode: (input) => jsonParse(input).chain((value) => codec.decode(value)),
		encode: (input) => JSON.stringify(codec.encode(input)),
		schema: () => codec.schema(),
	})

const messagesCodec = jsonString(
	nonEmptyList(
		Codec.interface({
			content: string,
			role: oneOf([exactly("user"), exactly("assistant")]),
			timestamp: number,
		})
	)
)

/**
 * Get handler
 * @returns Response
 */
const actions = {
	default: async ({ request }) => {
		const result = await EitherAsync.fromPromise<ActionError, FormData>(async () =>
			request
				.formData()
				.then((data) => Right(data))
				.catch((e) => Left({ code: 400, message: "Invalid form data", cause: e }))
		)
			.chain(async (data) => {
				const conversationData = data.get("conversation")
				return EitherAsync.liftEither(
					messagesCodec.decode(conversationData).mapLeft<ActionError>((error) => {
						return { code: 400, message: error }
					})
				).chain(async (messages) => {
					return ask({
						messages,
					})
						.then(({ message: { content, role } }) =>
							Right([...messages, { content, role, timestamp: Date.now() }])
						)
						.catch((e) =>
							Left<ActionError>({ code: 500, message: "Failed to get response", cause: e })
						)
				})
			})
			.run()
		return result.mapLeft(({ code, message }) => error(code, message)).extract()
	},
} satisfies Actions

export { actions }
export type { AskOptions }
// export default actions
