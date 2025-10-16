import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { ConfigExecutor } from "#duncan3142/git-tools/core/executor"
import {
	ConfigScope,
	type ConfigMode,
	type GitCommandError,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

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
			) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
				mode,
				scope = ConfigScope.Local(),
				timeout = "2 seconds",
			}) =>
				executor({ directory, mode, scope, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.config" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git config" }, span: { name: "git.config" } })
			)
		}),
	}
) {}

const { Default } = ConfigCommand

export { ConfigCommand, Default }
export type { Arguments }
