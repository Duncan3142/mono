import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { RemoteExecutor } from "#duncan3142/git-tools/core/executor"
import { RemoteMode, type GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { RepositoryConfig } from "#duncan3142/git-tools/core/config"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly timeout?: Duration.DurationInput
	readonly mode?: RemoteMode.RemoteMode
}

/**
 * Print refs service
 */
class RemoteCommand extends Effect.Service<RemoteCommand>()(
	TagFactory.make(`command`, `remote`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }, { defaultRemote }] = yield* Effect.all(
				[
					RemoteExecutor.RemoteExecutor,
					RepositoryContext.RepositoryContext,
					RepositoryConfig.RepositoryConfig,
				],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args?: Arguments
			) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
				mode = RemoteMode.Add({ remote: defaultRemote }),
				timeout = "2 seconds",
			} = {}) =>
				executor({ directory, timeout, mode }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.remote" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git remote" }, span: { name: "git.remote" } })
			)
		}),
	}
) {}

const { Default } = RemoteCommand

export { RemoteCommand, Default }
export type { Arguments }
