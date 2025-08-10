import { Effect, type Duration } from "effect"
import { AddExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

interface Arguments {
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class AddCommand extends Effect.Service<AddCommand>()(TagFactory.make(`command`, `branch`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[AddExecutor.AddExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		return ({ timeout = "2 seconds" }: Arguments = {}): Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> => executor({ directory, timeout })
	}),
}) {}

const { Default } = AddCommand

export { AddCommand, Default }
export type { Arguments }
