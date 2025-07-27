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
import { value as matchValue, when as matchWhen, option as matchOption } from "effect/Match"
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
import FetchCommand from "#command/fetch.service"

import {
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

const DEFAULT_DEPTH = 1

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

const FetchLive: Layer<Fetch, never, FetchCommand | PrintRefs> = layerEffect(
	Fetch,
	effectGen(function* () {
		const [fetchCommand, printRefs] = yield* effectAll([FetchCommand, PrintRefs], {
			concurrency: "unbounded",
		})

		return ({
			fetchRefs: { refs, remote },
			depth = DEFAULT_DEPTH,
			deepen = false,
		}: Arguments): Effect<WasFound, FetchRefsNotFoundError> =>
			effectGen(function* () {
				const doFetch =
					<E>(
						commandHandler: (result: Effect<void, FetchRefsNotFoundError>) => Effect<boolean, E>
					) =>
					(references: NonEmptyReadonlyArray<Reference>) =>
						pipe(
							fetchCommand({
								depth,
								deepen,
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
