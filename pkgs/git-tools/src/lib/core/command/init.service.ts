import { Effect, type Duration } from "effect"
import { InitExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

interface Arguments {
	readonly bare?: boolean
	readonly initBranch?: string
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class InitCommand extends Effect.Service<InitCommand>()(TagFactory.make(`command`, `init`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[InitExecutor.InitExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			bare = false,
			initBranch = "main",
			timeout = "2 seconds",
		}: Arguments = {}): Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> => executor({ directory, timeout, bare, initBranch })
	}),
}) {}

const { Default } = InitCommand

export { InitCommand, Default }
export type { Arguments }
