import { type Duration, Effect } from "effect"
import type { Reference, GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { RevParseExecutor } from "#duncan3142/git-tools/core/executor"
import { ExecutorDuration, WrapLog } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly ref: Reference.Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class RevParseCommand extends Effect.Service<RevParseCommand>()(
	TagFactory.make(`command`, `rev-parse`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[RevParseExecutor.RevParseExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				Reference.SHA,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = WrapLog.wrap("Git rev-parse", ({ ref, timeout = "2 seconds" }) =>
				executor({ ref, directory, timeout }).pipe(
					ExecutorDuration.duration,
					Effect.withSpan("git-rev-parse")
				)
			)
			return handler
		}),
	}
) {}

const { Default } = RevParseCommand

export { RevParseCommand, Default }
export type { Arguments }
