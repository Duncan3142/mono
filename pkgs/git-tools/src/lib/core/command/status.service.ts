import { Effect, pipe, type Duration } from "effect"
import { LogEffect } from "@duncan3142/effect"
import { StatusExecutor } from "#duncan3142/git-tools/lib/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

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
			) => Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = ({ timeout = "2 seconds" } = {}) =>
				executor({ directory, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.status" } }),
					Effect.withSpan("git.status")
				)

			return pipe(handler, LogEffect.wrap({ message: "Git status" }))
		}),
	}
) {}

const { Default } = StatusCommand

export { StatusCommand, Default }
export type { Arguments }
