import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { StatusExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class StatusCommand extends Effect.Service<StatusCommand>()(
	TagFactory.make(`command`, `status`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[StatusExecutor.StatusExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args?: Arguments
			) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
				timeout = "2 seconds",
			} = {}) =>
				executor({ directory, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.status" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git status" }, span: { name: "git.status" } })
			)
		}),
	}
) {}

const { Default } = StatusCommand

export { StatusCommand, Default }
export type { Arguments }
