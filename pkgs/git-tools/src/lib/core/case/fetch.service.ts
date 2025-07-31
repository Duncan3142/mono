import { Order, Effect, pipe, Record, Match, Array } from "effect"
import PrintRefs from "./print-refs.service.ts"
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
} from "#domain/fetch-reference"
import {
	type FetchDepthExceededError,
	type FetchRefsNotFoundError,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"
import type { FetchModeInput } from "#command/fetch.service"
import FetchDepth from "#state/fetch-depth.service"
import FetchCommand, { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH } from "#command/fetch.service"
import type { Reference } from "#domain/reference"
import RepositoryConfig from "#config/repository-config.service"

interface Arguments {
	remote?: Remote
	refs: Array.NonEmptyReadonlyArray<FetchReference>
	mode?: FetchModeInput
}

const handleFound = Effect.as(Found)

const handleRequired = handleFound

const handleOptional = <R>(result: Effect.Effect<void, FetchRefsNotFoundError, R>) =>
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
			printRefs,
			{
				defaultRemote,
				fetch: { defaultDepth },
			},
		] = yield* Effect.all([FetchCommand, PrintRefs, RepositoryConfig], {
			concurrency: "unbounded",
		})

		return ({
			refs,
			remote = defaultRemote,
			mode = { mode: FETCH_MODE_DEPTH, value: defaultDepth },
		}: Arguments): Effect.Effect<
			WasFound,
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

				const doFetch =
					<E>(
						commandHandler: (
							result: Effect.Effect<void, FetchRefsNotFoundError>
						) => Effect.Effect<boolean, E>
					) =>
					(references: Array.NonEmptyReadonlyArray<Reference>) =>
						pipe(
							fetchCommand({
								mode,
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
				return yield* pipe(
					printRefs({ level: "Debug", message: "Refs pre fetch" }),
					Effect.andThen(
						Effect.reduce(sequence, Found, (accumulator, effect) =>
							pipe(
								effect,
								Effect.map((result) => result && accumulator)
							)
						)
					),
					Effect.tap(printRefs({ level: "Debug", message: "Refs post fetch" }))
				)
			})
	}),
}) {}

export default Fetch
export type { Arguments }
