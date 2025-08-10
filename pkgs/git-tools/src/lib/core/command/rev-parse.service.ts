import { type Duration, Effect } from "effect"
import type { Reference, GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { RevParseExecutor } from "#duncan3142/git-tools/executor"

interface Arguments {
	readonly ref: Reference.Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `rev-parse`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[RevParseExecutor.Tag, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			ref,
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<
			Reference.SHA,
			GitCommandError.Failed | GitCommandError.Timeout
		> => executor({ ref, directory, timeout })
	}),
}) {}

const { Default } = Service

export { Service, Default }
export type { Arguments }
