import { Effect, pipe, type Duration } from "effect"
import { LogEffect } from "@duncan3142/effect"
import { RemoteExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { RemoteMode, type GitCommandError } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { RepositoryConfig } from "#duncan3142/git-tools/lib/core/config"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

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
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = ({ mode = RemoteMode.Add({ remote: defaultRemote }), timeout = "2 seconds" } = {}) =>
				executor({ directory, timeout, mode }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.remote" } }),
					Effect.withSpan("git.remote")
				)

			return pipe(handler, LogEffect.wrap({ message: "Git remote" }))
		}),
	}
) {}

const { Default } = RemoteCommand

export { RemoteCommand, Default }
export type { Arguments }
