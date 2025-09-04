import { Effect, type Duration } from "effect"
import { InitExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

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
		> = WrapLog.wrap(
			"Git init",
			({ bare = false, initBranch = "main", timeout = "2 seconds" } = {}) =>
				executor({ directory, timeout, bare, initBranch }).pipe(
					ExecutorDuration.duration,
					Effect.withSpan("git-init")
				)
		)
		return handler
	}),
}) {}

const { Default } = InitCommand

export { InitCommand, Default }
export type { Arguments }
