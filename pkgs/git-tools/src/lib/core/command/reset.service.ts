import { type Duration, Effect, pipe } from "effect"
import { LogSpan } from "@duncan3142/effect"
import {
	type Reference,
	type GitCommandError,
	ResetMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ResetExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

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
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = ({ ref, mode = ResetMode.Hard(), timeout = "2 seconds" }) =>
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
