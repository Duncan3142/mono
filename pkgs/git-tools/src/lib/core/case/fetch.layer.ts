import { effect as layerEffect, type Layer } from "effect/Layer"
import { catchTag as effectCatchTag } from "effect/Effect"
import { pipe } from "effect/Function"
import {
	type Effect,
	tap as effectTap,
	andThen as effectAndThen,
	reduce as effectReduce,
	map as effectMap,
	logWarning as effectLogWarning,
	as as effectAs,
	gen as effectGen,
	all as effectAll,
} from "effect/Effect"
import { toEntries as recordToEntries } from "effect/Record"
import {
	value as matchValue,
	when as matchWhen,
	exhaustive as matchExhaustive,
	option as matchOption,
} from "effect/Match"
import {
	type NonEmptyReadonlyArray,
	groupBy as arrayGroupBy,
	sortBy as arraySortBy,
	filterMap as arrayFilterMap,
	map as arrayMap,
} from "effect/Array"
import { mapInput as orderMapInput, number as orderNumber } from "effect/Order"
import Fetch, { type Arguments } from "./fetch.service.ts"
import PrintRefs from "./print-refs.service.ts"
import FetchDepth from "#state/fetch-depth.service"
import FetchCommand, { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH } from "#command/fetch.service"
import {
	type FetchDepthExceededError,
	type FetchRefsNotFoundError,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"
import {
	Found,
	type WasFound,
	NotFound,
	optionalString,
	REQUIRED,
	OPTIONAL,
	OPTIONALITY_ORDER_MAP,
} from "#domain/fetch-reference"
import type { Reference } from "#domain/reference"
import RepositoryConfig from "#config/repository-config.service"

const handleFound = effectAs(Found)

const handleRequired = handleFound

const handleOptional = <R>(result: Effect<void, FetchRefsNotFoundError, R>) =>
	pipe(
		result,
		handleFound,
		effectCatchTag(FETCH_REFS_NOT_FOUND_ERROR_TAG, () =>
			pipe(effectLogWarning("Failed to fetch one or more optional refs"), effectAs(NotFound))
		)
	)

const FetchLive: Layer<Fetch, never, FetchCommand | PrintRefs | RepositoryConfig | FetchDepth> =
	layerEffect(
		Fetch,
		effectGen(function* () {
			const [
				fetchCommand,
				printRefs,
				{
					defaultRemote,
					fetch: { defaultDepth },
				},
				fetchDepth,
			] = yield* effectAll([FetchCommand, PrintRefs, RepositoryConfig, FetchDepth], {
				concurrency: "unbounded",
			})

			return ({
				refs,
				remote = defaultRemote,
				mode = { mode: FETCH_MODE_DEPTH, value: defaultDepth },
			}: Arguments): Effect<WasFound, FetchRefsNotFoundError | FetchDepthExceededError> =>
				effectGen(function* () {
					yield* pipe(
						matchValue(mode),
						matchWhen({ mode: FETCH_MODE_DEPTH }, ({ value }) => fetchDepth.set(value)),
						matchWhen({ mode: FETCH_MODE_DEEPEN_BY }, ({ value }) => fetchDepth.inc(value)),
						matchExhaustive
					)

					const doFetch =
						<E>(
							commandHandler: (
								result: Effect<void, FetchRefsNotFoundError>
							) => Effect<boolean, E>
						) =>
						(references: NonEmptyReadonlyArray<Reference>) =>
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
						arrayGroupBy(optionalString),
						recordToEntries,
						arrayFilterMap(([key, fetchRefs]) =>
							pipe(
								matchValue(key),
								matchWhen(REQUIRED, (k) => [k, fetchRequired(fetchRefs)] as const),
								matchWhen(OPTIONAL, (k) => [k, fetchOptional(fetchRefs)] as const),
								matchOption
							)
						),
						arraySortBy(orderMapInput(orderNumber, ([key]) => OPTIONALITY_ORDER_MAP[key])),
						arrayMap(([_, effect]) => effect)
					)
					return yield* pipe(
						printRefs({ level: "Debug", message: "Refs pre fetch" }),
						effectAndThen(
							effectReduce(sequence, Found, (accumulator, effect) =>
								pipe(
									effect,
									effectMap((result) => result && accumulator)
								)
							)
						),
						effectTap(printRefs({ level: "Debug", message: "Refs post fetch" }))
					)
				})
		})
	)

export default FetchLive
