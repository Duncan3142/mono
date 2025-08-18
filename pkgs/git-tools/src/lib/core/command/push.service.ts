import { Effect, type Duration } from "effect"
import { PushExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError, Reference, Remote } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"
import { WrapLog } from "#duncan3142/git-tools/log"

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
					ExecutorDuration.duration
				)
		)
		return handler
	}),
}) {}

const { Default } = PushCommand

export { PushCommand, Default }
export type { Arguments }
