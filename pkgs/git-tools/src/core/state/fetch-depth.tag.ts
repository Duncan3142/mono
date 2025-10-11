import { Effect, Ref, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { type Fetch, FetchError } from "#duncan3142/git-tools/core/domain"

/**
 * Fetch depth service
 */
class FetchDepth extends Context.Tag(TagFactory.make(`state`, `fetch-depth`))<
	FetchDepth,
	{
		readonly id: string
		readonly inc: (by: Fetch.FetchDepth) => Effect.Effect<void, FetchError.FetchDepthExceeded>
		readonly set: (
			value: Fetch.FetchDepth
		) => Effect.Effect<void, FetchError.FetchDepthExceeded>
		readonly get: Effect.Effect<Fetch.FetchDepth>
	}
>() {}

type FetchDepthService = Context.Tag.Service<FetchDepth>

interface Args {
	readonly init: Fetch.FetchDepth
	readonly maxDepth: Fetch.FetchDepth
}

/**
 * Creates a new fetch depth service.
 * @param args - The arguments for the fetch depth service.
 * @param args.init - The initial fetch depth.
 * @param args.maxDepth - The maximum fetch depth.
 * @returns An Effect that produces a new fetch depth service.
 */
const make = ({ init, maxDepth }: Args): Effect.Effect<FetchDepthService> =>
	Effect.gen(function* () {
		const id = crypto.randomUUID()
		const ref = yield* Ref.make(init)

		const depthHandler = Effect.flatMap((depth: Fetch.FetchDepth) => {
			if (depth > maxDepth) {
				return Effect.fail(
					new FetchError.FetchDepthExceeded({ maxDepth, requestedDepth: depth })
				)
			}
			return Effect.void
		})

		return FetchDepth.of({
			id,
			inc: (by: Fetch.FetchDepth) => Ref.updateAndGet(ref, (n) => n + by).pipe(depthHandler),
			set: (value: Fetch.FetchDepth) => Ref.setAndGet(ref, value).pipe(depthHandler),
			get: Ref.get(ref),
		})
	})

export { FetchDepth, make }
export type { FetchDepthService, Args }
