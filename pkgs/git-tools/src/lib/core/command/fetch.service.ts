import type { Array } from "effect"
import { Effect, pipe, Match } from "effect"
import FetchExecutor from "#executor/fetch.service"
import { tag } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import { FETCH_DEEPEN_BY_TAG, FETCH_DEPTH_TAG, type FetchMode } from "#domain/fetch"

interface Arguments {
	readonly mode: FetchMode
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly directory: string
}

/**
 * Git fetch service
 */
class FetchCommand extends Effect.Service<FetchCommand>()(tag(`command`, `fetch`), {
	effect: Effect.gen(function* () {
		const fetchCommandExecutor = yield* FetchExecutor

		return ({
			refs,
			remote,
			mode,
			directory,
		}: Arguments): Effect.Effect<
			void,
			FetchRefsNotFoundError | FetchDepthExceededError,
			FetchDepth
		> =>
			Effect.gen(function* () {
				const fetchDepth = yield* FetchDepth
				yield* pipe(
					Match.value(mode),
					Match.when({ _tag: FETCH_DEPTH_TAG }, ({ depth }) => fetchDepth.set(depth)),
					Match.when({ _tag: FETCH_DEEPEN_BY_TAG }, ({ deepenBy }) => fetchDepth.inc(deepenBy)),
					Match.exhaustive
				)

				return yield* fetchCommandExecutor({
					mode,
					remote,
					refs,
					directory,
				})
			})
	}),
}) {}

export default FetchCommand
export type { Arguments }
