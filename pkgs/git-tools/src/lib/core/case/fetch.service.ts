import type { Array } from "effect"
import { Effect } from "effect"
import { tag } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import RepositoryConfig from "#config/repository-config.service"
import FetchCommand from "#command/fetch.service"
import { FetchDepth as FetchModeDepth } from "#domain/fetch"
import FetchDepthFactory from "#state/fetch-depth-factory.service"

interface Arguments {
	readonly remote?: Remote
	readonly directory: string
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly depth?: number
}

/**
 * Git fetch service
 */
class Fetch extends Effect.Service<Fetch>()(tag(`case`, `fetch`), {
	effect: Effect.gen(function* () {
		const [
			fetchCommand,
			{
				defaultRemote,
				fetch: { defaultDepth },
			},
			fetchDepthFactory,
		] = yield* Effect.all([FetchCommand, RepositoryConfig, FetchDepthFactory], {
			concurrency: "unbounded",
		})

		return ({
			refs,
			directory,
			remote = defaultRemote,
			depth = defaultDepth,
		}: Arguments): Effect.Effect<void, FetchRefsNotFoundError | FetchDepthExceededError> =>
			Effect.gen(function* () {
				return yield* fetchCommand({
					mode: FetchModeDepth({ depth }),
					remote,
					refs,
					directory,
				})
			}).pipe(Effect.provideServiceEffect(FetchDepth, fetchDepthFactory), Effect.scoped)
	}),
}) {}

export default Fetch
export type { Arguments }
