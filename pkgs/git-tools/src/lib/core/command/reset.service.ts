import { type Duration, Effect } from "effect"
import { type Reference, type GitCommandError, ResetMode } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { ResetExecutor } from "#duncan3142/git-tools/executor"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"

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

		return ({
			ref,
			mode = ResetMode.Hard(),
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> => executor({ ref, mode, directory, timeout }).pipe(ExecutorDuration.duration)
	}),
}) {}

const { Default } = ResetCommand

export { ResetCommand, Default }
export type { Arguments }
