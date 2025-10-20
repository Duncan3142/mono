import { Effect, pipe, type Duration } from "effect"
import { type CommandError, LogSpan } from "@duncan3142/effect"
import { BranchExecutor } from "#duncan3142/git-tools/core/executor"
import { BranchMode } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly mode?: BranchMode.BranchMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class BranchCommand extends Effect.Service<BranchCommand>()(
	TagFactory.make(`command`, `branch`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[BranchExecutor.BranchExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args?: Arguments
			) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
				mode = BranchMode.Print(),
				timeout = "2 seconds",
			} = {}) =>
				executor({ mode, directory, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.branch" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git branch" }, span: { name: "git.branch" } })
			)
		}),
	}
) {}

const { Default } = BranchCommand

export { BranchCommand, Default }
export type { Arguments }
