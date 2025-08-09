import { Effect, Ref, Context } from "effect"
import * as Const from "#const"
import * as FetchError from "#domain/fetch.error"
import * as Fetch from "#domain/fetch"

/**
 * Fetch depth service
 */
class Tag extends Context.Tag(Const.tag(`state`, `fetch-depth`))<
	Tag,
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
	}): Effect.Effect<Service> =>
		Effect.gen(function* () {
			const id = crypto.randomUUID()
			const ref = yield* Ref.make(init)

			const depthHandler = Effect.flatMap((depth: Fetch.Depth) => {
				if (depth > maxDepth) {
					return Effect.fail(new FetchError.DepthExceeded({ maxDepth, requestedDepth: depth }))
				}
				return Effect.void
			})

			return Tag.of({
				id,
				inc: (by: Fetch.Depth) => Ref.updateAndGet(ref, (n) => n + by).pipe(depthHandler),
				set: (value: Fetch.Depth) => Ref.setAndGet(ref, value).pipe(depthHandler),
				get: Ref.get(ref),
			})
		})
}

type Service = Context.Tag.Service<Tag>

export { Tag }
export type { Service }
