import { Effect, type Duration } from "effect"
import { InitExecutor } from "#duncan3142/git-tools/lib/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorDuration, ExecutorLog } from "#duncan3142/git-tools/lib/core/telemetry"

interface Arguments {
	readonly bare?: boolean
	readonly initBranch?: string
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class InitCommand extends Effect.Service<InitCommand>()(TagFactory.make(`command`, `init`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[InitExecutor.InitExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args?: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = ExecutorLog.wrap(
			"Git init",
			({ bare = false, initBranch = "main", timeout = "2 seconds" } = {}) =>
				executor({ directory, timeout, bare, initBranch }).pipe(
					ExecutorDuration.duration("git-init"),
					Effect.withSpan("git-init")
				)
		)
		return handler
	}),
}) {}

const { Default } = InitCommand

export { InitCommand, Default }
export type { Arguments }
