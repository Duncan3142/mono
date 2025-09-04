import { Effect, type Duration } from "effect"
import { AddExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class AddCommand extends Effect.Service<AddCommand>()(TagFactory.make(`command`, `add`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[AddExecutor.AddExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args?: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = WrapLog.wrap("Git add", ({ timeout = "2 seconds" } = {}) =>
			executor({ directory, timeout }).pipe(
				ExecutorDuration.duration,
				Effect.withSpan("git-add")
			)
		)
		return handler
	}),
}) {}

const { Default } = AddCommand

export { AddCommand, Default }
export type { Arguments }
