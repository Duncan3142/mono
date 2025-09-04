import { type Duration, Effect } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import type { MergeBaseError, Reference, GitCommandError } from "#duncan3142/git-tools/domain"
import { MergeBaseExecutor } from "#duncan3142/git-tools/executor"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"
import { WrapLog } from "#duncan3142/git-tools/log"

interface Arguments {
	readonly headRef: Reference.Reference
	readonly baseRef: Reference.Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Reference service
 */
class MergeBaseCommand extends Effect.Service<MergeBaseCommand>()(
	TagFactory.make(`command`, `merge-base`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[MergeBaseExecutor.MergeBaseExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				Reference.SHA,
				| GitCommandError.GitCommandFailed
				| GitCommandError.GitCommandTimeout
				| MergeBaseError.MergeBaseNotFound
			> = WrapLog.wrap("Git merge-base", ({ headRef, baseRef, timeout = "2 seconds" }) =>
				executor({
					headRef,
					baseRef,
					directory,
					timeout,
				}).pipe(ExecutorDuration.duration, Effect.withSpan("git-merge-base"))
			)
			return handler
		}),
	}
) {}

const { Default } = MergeBaseCommand

export { MergeBaseCommand, Default }
export type { Arguments }
