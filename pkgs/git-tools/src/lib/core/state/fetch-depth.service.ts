import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import { SERVICE_PREFIX } from "#const"
import type { FetchDepthExceededError } from "#domain/fetch.error"

/**
 * Fetch depth service
 */
class FetchDepth extends Tag(`${SERVICE_PREFIX}/case/fetch-depth`)<
	FetchDepth,
	{
		inc: (by: number) => Effect<void, FetchDepthExceededError>
		get: Effect<number>
		set: (value: number) => Effect<void, FetchDepthExceededError>
	}
>() {}

export default FetchDepth
