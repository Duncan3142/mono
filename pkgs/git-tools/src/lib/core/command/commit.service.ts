import { Effect, type Duration } from "effect"
import { CommitExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

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
				executor({ directory, timeout, message }).pipe(
					ExecutorDuration.duration,
					Effect.withSpan("git-commit")
				)
			)
			return handler
		}),
	}
) {}

const { Default } = CommitCommand

export { CommitCommand, Default }
export type { Arguments }
