import { fail, type Actions } from "@sveltejs/kit"
import { EitherAsync } from "purify-ts/EitherAsync"
import { string } from "purify-ts/Codec"
import type { AskOptions } from "$lib/chat/ai"
import { HTTPError, STATUS_400, STATUS_500 } from "$lib/http"

/**
 * Actions
 */
const actions = {
	default: async ({ request, fetch }) => {
		const response = await EitherAsync<Error, FormData>(() => request.formData())
			.mapLeft((e: unknown) => new HTTPError(STATUS_400, "Invalid form data", e))
			.chain((formData) => {
				const conversationData = formData.get("conversation")
				return EitherAsync(() =>
					fetch("/api/chat", {
						body: conversationData,
						method: "POST",
					})
				)
					.chain(async (message) => string.decode(await message.json()))
					.ifLeft((e) => {
						console.error(e)
					})
					.mapLeft((e: unknown) => new HTTPError(STATUS_500, "Unable to generate message", e))
			})
			.mapLeft(({ code, message }) => fail(code, { message }))
			.run()
		return response.extract()
	},
} satisfies Actions

const ssr = false

export { actions, ssr }
export type { AskOptions }
