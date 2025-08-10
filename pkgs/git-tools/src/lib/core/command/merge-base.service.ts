import type { Duration } from "effect"
import { Effect } from "effect"
import { TagFactory } from "#const"
import { MergeBaseError, Reference, GitCommandError } from "#domain"
import { MergeBaseExecutor } from "#executor"
import { RepositoryContext } from "#context"

interface Arguments {
	readonly headRef: Reference.Reference
	readonly baseRef: Reference.Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Reference service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `merge-base`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[MergeBaseExecutor.Tag, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			headRef,
			baseRef,
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<
			Reference.SHA,
			GitCommandError.Failed | GitCommandError.Timeout | MergeBaseError.NotFound
		> =>
			executor({
				headRef,
				baseRef,
				directory,
				timeout,
			})
	}),
}) {}

export { Service }
export type { Arguments }
