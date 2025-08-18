import { type Duration, Effect } from "effect"
import type { Reference, GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { RevParseExecutor } from "#duncan3142/git-tools/executor"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"

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

			return ({
				ref,
				timeout = "2 seconds",
			}: Arguments): Effect.Effect<
				Reference.SHA,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => executor({ ref, directory, timeout }).pipe(ExecutorDuration.duration)
		}),
	}
) {}

const { Default } = RevParseCommand

export { RevParseCommand, Default }
export type { Arguments }
