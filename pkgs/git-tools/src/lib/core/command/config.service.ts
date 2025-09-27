import { Effect, type Duration } from "effect"
import { ConfigExecutor } from "#duncan3142/git-tools/lib/core/executor"
import {
	ConfigScope,
	type ConfigMode,
	type GitCommandError,
} from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorDuration, ExecutorLog } from "#duncan3142/git-tools/lib/core/telemetry"

interface Arguments {
	readonly mode: ConfigMode.ConfigMode
	readonly scope?: ConfigScope.ConfigScope
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class ConfigCommand extends Effect.Service<ConfigCommand>()(
	TagFactory.make(`command`, `config`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[ConfigExecutor.ConfigExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = ExecutorLog.wrap(
				"Git config",
				({ mode, scope = ConfigScope.Local(), timeout = "2 seconds" }) =>
					executor({ directory, mode, scope, timeout }).pipe(
						ExecutorDuration.duration("git-config"),
						Effect.withSpan("git-config")
					)
			)
			return handler
		}),
	}
) {}

const { Default } = ConfigCommand

export { ConfigCommand, Default }
export type { Arguments }
