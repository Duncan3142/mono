import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { CommitExecutor } from "#duncan3142/git-tools/lib/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

interface Arguments {
	readonly message: string
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class CommitCommand extends Effect.Service<CommitCommand>()(
	TagFactory.make(`command`, `commit`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[CommitExecutor.CommitExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = ({ message, timeout = "2 seconds" }) =>
				executor({ directory, timeout, message }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.commit" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git commit" }, span: { name: "git.commit" } })
			)
		}),
	}
) {}

const { Default } = CommitCommand

export { CommitCommand, Default }
export type { Arguments }
