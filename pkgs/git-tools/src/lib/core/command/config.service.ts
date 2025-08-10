import { Effect, type Duration } from "effect"
import { ConfigExecutor } from "#duncan3142/git-tools/executor"
import {
	ConfigScope,
	type ConfigMode,
	type GitCommandError,
} from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

interface Arguments {
	readonly mode: ConfigMode.ConfigMode
	readonly scope?: ConfigScope.ConfigScope
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class ConfigCommand extends Effect.Service<ConfigCommand>()(
	TagFactory.make(`command`, `branch`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[ConfigExecutor.ConfigExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			return ({
				mode,
				scope = ConfigScope.Local(),
				timeout = "2 seconds",
			}: Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ directory, mode, scope, timeout })
		}),
	}
) {}

const { Default } = ConfigCommand

export { ConfigCommand, Default }
export type { Arguments }
