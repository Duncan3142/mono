import { Order, Effect, pipe, Record, Match, Array } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"
import {
	type FetchReference,
	type WasFound,
	Found,
	NotFound,
	optionalString,
	REQUIRED,
	OPTIONAL,
	OPTIONALITY_ORDER_MAP,
	FETCH_MODE_DEPTH,
} from "#domain/fetch-reference"
import {
	type FetchDepthExceededError,
	type FetchRefsNotFoundError,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"
import type FetchDepth from "#state/fetch-depth.service"
import type { Reference } from "#domain/reference"
import RepositoryConfig from "#config/repository-config.service"
import FetchCommand from "#command/fetch.service"

interface Arguments {
	remote?: Remote
	refs: Array.NonEmptyReadonlyArray<FetchReference>
	depth?: number
}

const handleFound = Effect.as(Found)

const handleRequired = handleFound

const handleOptional = <R>(
	result: Effect.Effect<void, FetchRefsNotFoundError | FetchDepthExceededError, R>
) =>
	pipe(
		result,
		handleFound,
		Effect.catchTag(FETCH_REFS_NOT_FOUND_ERROR_TAG, () =>
			pipe(Effect.logWarning("Failed to fetch one or more optional refs"), Effect.as(NotFound))
		)
	)

/**
 * Git fetch service
 */
class Fetch extends Effect.Service<Fetch>()(`${SERVICE_PREFIX}/case/fetch`, {
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
			WasFound,
			FetchRefsNotFoundError | FetchDepthExceededError,
			FetchDepth
		> =>
			Effect.gen(function* () {
				const doFetch =
					<E>(
						commandHandler: (
							result: Effect.Effect<
								void,
								FetchRefsNotFoundError | FetchDepthExceededError,
								FetchDepth
							>
						) => Effect.Effect<boolean, E, FetchDepth>
					) =>
					(references: Array.NonEmptyReadonlyArray<Reference>) =>
						pipe(
							fetchCommand({
								mode: { mode: FETCH_MODE_DEPTH, value: depth },
								remote,
								refs: references,
							}),
							commandHandler
						)

				const fetchRequired = doFetch(handleRequired)

				const fetchOptional = doFetch(handleOptional)

				const sequence = pipe(
					refs,
					Array.groupBy(optionalString),
					Record.toEntries,
					Array.filterMap(([key, fetchRefs]) =>
						pipe(
							Match.value(key),
							Match.when(REQUIRED, (k) => [k, fetchRequired(fetchRefs)] as const),
							Match.when(OPTIONAL, (k) => [k, fetchOptional(fetchRefs)] as const),
							Match.option
						)
					),
					Array.sortBy(Order.mapInput(Order.number, ([key]) => OPTIONALITY_ORDER_MAP[key])),
					Array.map(([_, effect]) => effect)
				)
				return yield* Effect.reduce(sequence, Found, (accumulator, effect) =>
					pipe(
						effect,
						Effect.map((result) => result && accumulator)
					)
				)
			})
	}),
}) {}

export default Fetch
export type { Arguments }
