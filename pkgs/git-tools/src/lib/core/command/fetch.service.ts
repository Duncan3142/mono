import type { Array } from "effect"
import { Effect, pipe, Match } from "effect"
import FetchCommandExecutor from "./fetch-executor.service.ts"
import { tag } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import {
	FETCH_MODE_DEEPEN_BY,
	FETCH_MODE_DEPTH,
	type FetchModeInput,
} from "#domain/fetch-reference"

interface Arguments {
	readonly mode: FetchModeInput
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
}

/**
 * Git fetch service
 */
class FetchCommand extends Effect.Service<FetchCommand>()(tag(`command/fetch`), {
	effect: Effect.gen(function* () {
		const [fetchCommandExecutor] = yield* Effect.all([FetchCommandExecutor], {
			concurrency: "unbounded",
		})

		return ({
			refs,
			remote,
			mode,
		}: Arguments): Effect.Effect<
			void,
			FetchRefsNotFoundError | FetchDepthExceededError,
			FetchDepth
		> =>
			Effect.gen(function* () {
				const fetchDepth = yield* FetchDepth
				yield* pipe(
					Match.value(mode),
					Match.when({ mode: FETCH_MODE_DEPTH }, ({ value }) => fetchDepth.set(value)),
					Match.when({ mode: FETCH_MODE_DEEPEN_BY }, ({ value }) => fetchDepth.inc(value)),
					Match.exhaustive
				)

				return yield* fetchCommandExecutor({
					mode,
					remote,
					refs,
				})
			})
	}),
}) {}

export default FetchCommand
export type { Arguments }
