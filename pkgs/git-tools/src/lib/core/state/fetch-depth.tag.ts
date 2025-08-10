import { Effect, Ref, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { type Fetch, FetchError } from "#duncan3142/git-tools/domain"

/**
 * Fetch depth service
 */
class Tag extends Context.Tag(TagFactory.make(`state`, `fetch-depth`))<
	Tag,
	{
		readonly id: string
		readonly inc: (by: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		readonly set: (value: Fetch.Depth) => Effect.Effect<void, FetchError.DepthExceeded>
		readonly get: Effect.Effect<Fetch.Depth>
	}
>() {}

interface Args {
	readonly init: Fetch.Depth
	readonly maxDepth: Fetch.Depth
}

/**
 * Creates a new fetch depth service.
 * @param args - The arguments for the fetch depth service.
 * @param args.init - The initial fetch depth.
 * @param args.maxDepth - The maximum fetch depth.
 * @returns An Effect that produces a new fetch depth service.
 */
const make = ({ init, maxDepth }: Args): Effect.Effect<Service> =>
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
export type { Service, Args }
