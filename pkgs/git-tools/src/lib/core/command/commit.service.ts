import { Effect, type Duration } from "effect"
import { CommitExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

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

			return ({
				message,
				timeout = "2 seconds",
			}: Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ directory, timeout, message })
		}),
	}
) {}

const { Default } = CommitCommand

export { CommitCommand, Default }
export type { Arguments }
