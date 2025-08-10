import type { Array, Duration } from "effect"
import { Effect } from "effect"
import { FetchExecutor } from "#executor"
import { TagFactory } from "#const"
import { Remote, FetchError, FetchMode, Reference, GitCommandError } from "#domain"
import { FetchDepth } from "#state"
import { RepositoryConfig } from "#config"
import { RepositoryContext } from "#context"

interface Arguments {
	readonly refs: Array.NonEmptyReadonlyArray<Reference.Reference>
	readonly mode?: FetchMode.Mode
	readonly remote?: Remote.Remote
	readonly timeout?: Duration.DurationInput
}

/**
 * Git fetch service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `fetch`), {
	effect: Effect.gen(function* () {
		const [
			executor,
			{
				defaultRemote,
				fetch: { defaultDepth },
			},
			{ directory },
		] = yield* Effect.all(
			[FetchExecutor.Tag, RepositoryConfig.Service, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			refs,
			remote = defaultRemote,
			mode = FetchMode.Depth({ depth: defaultDepth }),
			timeout = "4 seconds",
		}: Arguments): Effect.Effect<
			void,
			| FetchError.DepthExceeded
			| FetchError.RefsNotFound
			| GitCommandError.Failed
			| GitCommandError.Timeout,
			FetchDepth.Tag
		> =>
			Effect.gen(function* () {
				const fetchDepth = yield* FetchDepth.Tag
				yield* FetchMode.$match(mode, {
					Depth: ({ depth }) => fetchDepth.set(depth),
					DeepenBy: ({ deepenBy }) => fetchDepth.inc(deepenBy),
				})

				return yield* executor({
					mode,
					remote,
					refs,
					directory,
					timeout,
				})
			})
	}),
}) {}

export { Service }
export type { Arguments }
