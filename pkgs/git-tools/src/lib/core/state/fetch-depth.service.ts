import type { Effect } from "effect"
import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { FetchDepthExceededError } from "#domain/fetch.error"

/**
 * Fetch depth service
 */
class FetchDepth extends Context.Tag(`${SERVICE_PREFIX}/case/fetch-depth`)<
	FetchDepth,
	{
		inc: (by: number) => Effect.Effect<void, FetchDepthExceededError>
		get: Effect.Effect<number>
		set: (value: number) => Effect.Effect<void, FetchDepthExceededError>
	}
>() {}

export default FetchDepth
