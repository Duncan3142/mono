import { type Duration, Effect } from "effect"
import {
	type Reference,
	type GitCommandError,
	ResetMode,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ResetExecutor } from "#duncan3142/git-tools/core/executor"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

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
		> = WrapLog.wrap("Git reset", ({ ref, mode = ResetMode.Hard(), timeout = "2 seconds" }) =>
			executor({ ref, mode, directory, timeout }).pipe(
				ExecutorDuration.duration,
				Effect.withSpan("git-reset")
			)
		)
		return handler
	}),
}) {}

const { Default } = ResetCommand

export { ResetCommand, Default }
export type { Arguments }
