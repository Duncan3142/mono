import { type Duration, Effect } from "effect"
import { type Reference, type GitCommandError, ResetMode } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { ResetExecutor } from "#duncan3142/git-tools/executor"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"
import { WrapLog } from "#duncan3142/git-tools/log"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode?: ResetMode.ResetMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class ResetCommand extends Effect.Service<ResetCommand>()(TagFactory.make(`command`, `reset`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[ResetExecutor.ResetExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = WrapLog.wrap("Git reset", ({ ref, mode = ResetMode.Hard(), timeout = "2 seconds" }) =>
			executor({ ref, mode, directory, timeout }).pipe(
				ExecutorDuration.duration,
				Effect.withSpan("git-reset")
			)
		)
		return handler
	}),
}) {}

const { Default } = ResetCommand

export { ResetCommand, Default }
export type { Arguments }
