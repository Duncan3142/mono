import { Effect, type Duration } from "effect"
import { PushExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError, Reference, Remote } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { RepositoryConfig } from "#duncan3142/git-tools/core/config"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly timeout?: Duration.DurationInput
	readonly forceWithLease?: boolean
	readonly ref: Reference.Reference
	readonly remote?: Remote.Remote
}

/**
 * Print refs service
 */
class PushCommand extends Effect.Service<PushCommand>()(TagFactory.make(`command`, `push`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }, { defaultRemote }] = yield* Effect.all(
			[
				PushExecutor.PushExecutor,
				RepositoryContext.RepositoryContext,
				RepositoryConfig.RepositoryConfig,
			],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = WrapLog.wrap(
			"Git push",
			({ ref, forceWithLease = false, remote = defaultRemote, timeout = "2 seconds" }) =>
				executor({ directory, timeout, forceWithLease, ref, remote }).pipe(
					ExecutorDuration.duration,
					Effect.withSpan("git-push")
				)
		)
		return handler
	}),
}) {}

const { Default } = PushCommand

export { PushCommand, Default }
export type { Arguments }
