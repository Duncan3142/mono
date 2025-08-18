import { Effect, type Duration } from "effect"
import { CommitExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"
import { WrapLog } from "#duncan3142/git-tools/log"

interface Arguments {
	readonly message: string
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class CommitCommand extends Effect.Service<CommitCommand>()(
	TagFactory.make(`command`, `commit`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[CommitExecutor.CommitExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = WrapLog.wrap("Git commit", ({ message, timeout = "2 seconds" }) =>
				executor({ directory, timeout, message }).pipe(ExecutorDuration.duration)
			)
			return handler
		}),
	}
) {}

const { Default } = CommitCommand

export { CommitCommand, Default }
export type { Arguments }
