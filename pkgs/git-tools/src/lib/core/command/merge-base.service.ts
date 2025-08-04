import type { Duration } from "effect"
import { Effect } from "effect"
import { tag } from "#const"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseExecutor from "#executor/merge-base.service"
import type FetchDepth from "#state/fetch-depth.service"
import Repository from "#context/repository.service"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Reference service
 */
class MergeBaseCommand extends Effect.Service<MergeBaseCommand>()(
	tag(`command`, `merge-base`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all([MergeBaseExecutor, Repository], {
				concurrency: "unbounded",
			})

			return ({
				headRef,
				baseRef,
				timeout = "2 seconds",
			}: Arguments): Effect.Effect<string, MergeBaseNotFoundError, FetchDepth> =>
				executor({
					headRef,
					baseRef,
					directory,
					timeout,
				})
		}),
	}
) {}

export default MergeBaseCommand
export type { Arguments }
