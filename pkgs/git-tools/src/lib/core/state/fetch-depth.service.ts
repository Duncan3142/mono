import { Effect, Ref, Context } from "effect"
import * as Const from "#const"
import * as FetchError from "#domain/fetch.error"
import * as Fetch from "#domain/fetch"

const handleFetchDepth = (maxDepth: Fetch.Depth) =>
	Effect.flatMap((depth: Fetch.Depth) => {
		if (depth > maxDepth) {
			return Effect.fail(new FetchError.DepthExceeded({ maxDepth, requestedDepth: depth }))
		}
		return Effect.void
	})

/**
 * Fetch depth service
 */
class FetchDepth extends Context.Tag(Const.tag(`state`, `fetch-depth`))<
	FetchDepth,
	{
		id: string
		inc: (by: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		set: (value: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		get: Effect.Effect<Fetch.Depth>
	}
>() {
	public static make = ({
		init,
		maxDepth,
	}: {
		init: Fetch.Depth
		maxDepth: Fetch.Depth
	}): Effect.Effect<FetchDepthService> =>
		Effect.gen(function* () {
			const id = crypto.randomUUID()
			const ref = yield* Ref.make(init)

			return FetchDepth.of({
				id,
				inc: (by: Fetch.Depth) =>
					Ref.updateAndGet(ref, (n) => n + by).pipe(handleFetchDepth(maxDepth)),
				set: (value: Fetch.Depth) => Ref.setAndGet(ref, value).pipe(handleFetchDepth(maxDepth)),
				get: Ref.get(ref),
			})
		})
}

type FetchDepthService = Context.Tag.Service<FetchDepth>

export { FetchDepth }
export type { FetchDepthService }
