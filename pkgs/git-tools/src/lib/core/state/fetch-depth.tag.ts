import { Effect, Ref, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { type Fetch, FetchError  } from "#duncan3142/git-tools/domain";

/**
 * Fetch depth service
 */
class Tag extends Context.Tag(TagFactory.make(`state`, `fetch-depth`))<
	Tag,
	{
		id: string
		inc: (by: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		set: (value: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		get: Effect.Effect<Fetch.Depth>
	}
>() {}

/**
 * @param root0
 * @param root0.init
 * @param root0.maxDepth
 */
const make = ({
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

type Service = Context.Tag.Service<Tag>

export { Tag, make }
export type { Service }
