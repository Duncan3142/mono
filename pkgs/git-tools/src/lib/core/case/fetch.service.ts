import type { Array } from "effect"
import { Effect } from "effect"
import { tag } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import type FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import RepositoryConfig from "#config/repository-config.service"
import FetchCommand from "#command/fetch.service"
import { FetchDepth as FetchModeDepth } from "#domain/fetch"

interface Arguments {
	remote?: Remote
	refs: Array.NonEmptyReadonlyArray<Reference>
	depth?: number
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
		] = yield* Effect.all([FetchCommand, RepositoryConfig], {
			concurrency: "unbounded",
		})

		return ({
			refs,
			remote = defaultRemote,
			depth = defaultDepth,
		}: Arguments): Effect.Effect<
			void,
			FetchRefsNotFoundError | FetchDepthExceededError,
			FetchDepth
		> =>
			Effect.gen(function* () {
				return yield* fetchCommand({
					mode: FetchModeDepth({ depth }),
					remote,
					refs,
				})
			})
	}),
}) {}

export default Fetch
export type { Arguments }
