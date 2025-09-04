import { Effect, type Duration } from "effect"
import { BranchExecutor } from "#duncan3142/git-tools/core/executor"
import { type GitCommandError, BranchMode } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly mode?: BranchMode.BranchMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class BranchCommand extends Effect.Service<BranchCommand>()(
	TagFactory.make(`command`, `branch`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[BranchExecutor.BranchExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args?: Arguments
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = WrapLog.wrap(
				"Git branch",
				({ mode = BranchMode.Print(), timeout = "2 seconds" } = {}) =>
					executor({ mode, directory, timeout }).pipe(
						ExecutorDuration.duration,
						Effect.withSpan("git-branch")
					)
			)
			return handler
		}),
	}
) {}

const { Default } = BranchCommand

export { BranchCommand, Default }
export type { Arguments }
