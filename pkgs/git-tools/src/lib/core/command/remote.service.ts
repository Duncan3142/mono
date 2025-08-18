import { Effect, type Duration } from "effect"
import { RemoteExecutor } from "#duncan3142/git-tools/executor"
import { RemoteMode, type GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"

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

			return ({
				mode = RemoteMode.Add({ remote: defaultRemote }),
				timeout = "2 seconds",
			}: Arguments = {}): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ directory, timeout, mode }).pipe(ExecutorDuration.duration)
		}),
	}
) {}

const { Default } = RemoteCommand

export { RemoteCommand, Default }
export type { Arguments }
