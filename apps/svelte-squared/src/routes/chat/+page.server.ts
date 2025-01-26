import { fail, type Actions } from "@sveltejs/kit"
import { Left, Right } from "purify-ts/Either"
import { EitherAsync } from "purify-ts/EitherAsync"
import type { AskOptions } from "$lib/server/ollama"
import { HTTPError } from "$lib/http"

/**
 * Actions
 */
const actions = {
	default: async ({ request, fetch }) =>
		EitherAsync.fromPromise<HTTPError, FormData>(async () =>
			request
				.formData()
				.then((data) => Right(data))
				.catch((e) => Left(new HTTPError(400, "Invalid form data", e)))
		)
			.chain(async (data) => {
				const conversationData = data.get("conversation")
				return fetch("/api/chat", {
					body: conversationData,
					method: "POST",
				})
					.then(async (data) => Right(await data.json()))
					.catch((e) => Left(new HTTPError(400, "Invalid form data", e)))
			})
			.run()
			.then((result) =>
				result.mapLeft(({ code, message }) => fail(code, { message })).extract()
			),
} satisfies Actions

const ssr = false

export { actions, ssr }
export type { AskOptions }

// export default actions
