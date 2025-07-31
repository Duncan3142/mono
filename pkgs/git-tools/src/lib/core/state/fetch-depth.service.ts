import { Effect, Ref, Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import { FetchDepthExceededError } from "#domain/fetch.error"

type Depth = number

const handleFetchDepth = (maxDepth: Depth) =>
	Effect.flatMap((depth: Depth) => {
		if (depth > maxDepth) {
			return Effect.fail(new FetchDepthExceededError({ maxDepth, requestedDepth: depth }))
		}
		return Effect.void
	})

/**
 * Fetch depth service
 */
class FetchDepth extends Context.Tag(`${SERVICE_PREFIX}/state/fetch-depth`)<
	FetchDepth,
	{
		id: string
		inc: (by: Depth) => Effect.Effect<void, FetchDepthExceededError>
		set: (value: Depth) => Effect.Effect<void, FetchDepthExceededError>
		get: Effect.Effect<Depth>
	}
>() {
	public static make = ({
		init,
		maxDepth,
	}: {
		init: Depth
		maxDepth: Depth
	}): Effect.Effect<FetchDepthService> =>
		Effect.gen(function* () {
			const id = crypto.randomUUID()
			const ref = yield* Ref.make(init)

			return FetchDepth.of({
				id,
				inc: (by: Depth) =>
					Ref.updateAndGet(ref, (n) => n + by).pipe(handleFetchDepth(maxDepth)),
				set: (value: Depth) => Ref.setAndGet(ref, value).pipe(handleFetchDepth(maxDepth)),
				get: Ref.get(ref),
			})
		})
}

type FetchDepthService = Context.Tag.Service<FetchDepth>

export default FetchDepth
export type { FetchDepthService }
