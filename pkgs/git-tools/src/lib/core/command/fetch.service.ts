import { type Array, type Duration, Effect  } from "effect"
import { FetchExecutor } from "#duncan3142/git-tools/executor"
import { TagFactory } from "#duncan3142/git-tools/const"
import {
	type Remote,
	type FetchError,
	type Reference,
	type GitCommandError,
	FetchMode
} from "#duncan3142/git-tools/domain";
import { FetchDepth } from "#duncan3142/git-tools/state"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import { RepositoryContext } from "#duncan3142/git-tools/context"

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

const {Default} = Service

export { Service, Default }
export type { Arguments }
