import { Effect, type Duration } from "effect"
import { StatusExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

interface Arguments {
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class StatusCommand extends Effect.Service<StatusCommand>()(
	TagFactory.make(`command`, `status`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[StatusExecutor.StatusExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			return ({ timeout = "2 seconds" }: Arguments = {}): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ directory, timeout })
		}),
	}
) {}

const { Default } = StatusCommand

export { StatusCommand, Default }
export type { Arguments }
