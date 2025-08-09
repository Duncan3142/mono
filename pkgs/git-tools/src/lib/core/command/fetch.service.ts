import type { Array, Duration } from "effect"
import { Effect, pipe, Match } from "effect"
import FetchExecutor from "#executor/fetch.service"
import { Tag } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import {
	FETCH_DEEPEN_BY_TAG,
	FETCH_DEPTH_TAG,
	type FetchMode,
	FetchModeDepth,
} from "#domain/fetch"
import RepositoryConfig from "#config/repository-config.service"
import Tag from "#context/repository.service"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly mode?: FetchMode
	readonly remote?: Remote
	readonly timeout?: Duration.DurationInput
}

/**
 * Git fetch service
 */
class FetchCommand extends Effect.Service<FetchCommand>()(tag(`command`, `fetch`), {
	effect: Effect.gen(function* () {
		const [
			executor,
			{
				defaultRemote,
				fetch: { defaultDepth },
			},
			{ directory },
		] = yield* Effect.all([FetchExecutor, RepositoryConfig, Tag], {
			concurrency: "unbounded",
		})

		return ({
			refs,
			remote = defaultRemote,
			mode = FetchModeDepth({ depth: defaultDepth }),
			timeout = "4 seconds",
		}: Arguments): Effect.Effect<
			void,
			| FetchDepthExceededError
			| FetchRefsNotFoundError
			| GitCommandFailedError
			| GitCommandTimeoutError,
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

export default FetchCommand
export type { Arguments }
