import type { Duration } from "effect"
import { Effect } from "effect"
import { Reference, GitCommandError } from "#domain"
import { TagFactory } from "#const"
import { RepositoryContext } from "#context"
import { RevParseExecutor } from "#executor"

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

const Default = Service.Default

export { Service, Default }
export type { Arguments }
