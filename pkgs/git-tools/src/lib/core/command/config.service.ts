import { Effect, type Duration } from "effect"
import { ConfigExecutor } from "#duncan3142/git-tools/core/executor"
import {
	ConfigScope,
	type ConfigMode,
	type GitCommandError,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

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
			> = WrapLog.wrap(
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
