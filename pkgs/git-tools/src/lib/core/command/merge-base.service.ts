import type { Duration } from "effect"
import { Effect } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { MergeBaseError, Reference, GitCommandError } from "#duncan3142/git-tools/domain"
import { MergeBaseExecutor } from "#duncan3142/git-tools/executor"
import { RepositoryContext } from "#duncan3142/git-tools/context"

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

const Default = Service.Default

export { Service, Default }
export type { Arguments }
