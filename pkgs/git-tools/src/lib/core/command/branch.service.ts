import { Effect, type Duration } from "effect"
import { BranchExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, BranchMode } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

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

			return ({
				mode = BranchMode.Print(),
				timeout = "2 seconds",
			}: Arguments = {}): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ mode, directory, timeout })
		}),
	}
) {}

const { Default } = BranchCommand

export { BranchCommand, Default }
export type { Arguments }
