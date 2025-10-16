import { type Duration, Effect, pipe } from "effect"
import { LogSpan } from "@duncan3142/effect"
import {
	type Reference,
	type GitCommandError,
	ResetMode,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ResetExecutor } from "#duncan3142/git-tools/core/executor"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode?: ResetMode.ResetMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class ResetCommand extends Effect.Service<ResetCommand>()(TagFactory.make(`command`, `reset`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[ResetExecutor.ResetExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args: Arguments
		) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
			ref,
			mode = ResetMode.Hard(),
			timeout = "2 seconds",
		}) =>
			executor({ ref, mode, directory, timeout }).pipe(
				ExecutorTimer.duration({ tags: { "executor.name": "git.reset" } })
			)

		return pipe(
			handler,
			LogSpan.wrap({ log: { message: "Git reset" }, span: { name: "git.reset" } })
		)
	}),
}) {}

const { Default } = ResetCommand

export { ResetCommand, Default }
export type { Arguments }
