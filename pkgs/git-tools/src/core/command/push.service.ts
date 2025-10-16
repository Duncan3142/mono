import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { PushExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError, Reference, Remote } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { RepositoryConfig } from "#duncan3142/git-tools/core/config"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

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
		) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
			ref,
			forceWithLease = false,
			remote = defaultRemote,
			timeout = "2 seconds",
		}) =>
			executor({ directory, timeout, forceWithLease, ref, remote }).pipe(
				ExecutorTimer.duration({ tags: { "executor.name": "git.push" } })
			)

		return pipe(
			handler,
			LogSpan.wrap({ log: { message: "Git push" }, span: { name: "git.push" } })
		)
	}),
}) {}

const { Default } = PushCommand

export { PushCommand, Default }
export type { Arguments }
