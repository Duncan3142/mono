import { type Duration, Effect, pipe } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type {
	MergeBaseError,
	Reference,
	GitCommandError,
} from "#duncan3142/git-tools/core/domain"
import { MergeBaseExecutor } from "#duncan3142/git-tools/core/executor"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

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
			> = ({ headRef, baseRef, timeout = "2 seconds" }) =>
				executor({
					headRef,
					baseRef,
					directory,
					timeout,
				}).pipe(ExecutorTimer.duration({ tags: { "executor.name": "git.merge-base" } }))

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git merge-base" }, span: { name: "git.merge-base" } })
			)
		}),
	}
) {}

const { Default } = MergeBaseCommand

export { MergeBaseCommand, Default }
export type { Arguments }
