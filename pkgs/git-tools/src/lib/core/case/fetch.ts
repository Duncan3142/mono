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
import { pipe } from "effect/Function"
import { catchTag as effectCatchTag } from "effect/Effect"
import { mapInput as orderMapInput, number as orderNumber } from "effect/Order"
import PrintRefs from "./print-refs.service.ts"
import type { Arguments } from "./fetch.service.ts"
import FetchCommand from "#command/fetch.service"
import {
	type FetchReferenceNotFoundError,
	FETCH_REFERENCE_NOT_FOUND_ERROR_TAG,
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
import { DEFAULT_REMOTE } from "#domain/remote"
import type { Reference } from "#domain/reference"

const DEFAULT_DEPTH = 1

const handleFound = effectAs(Found)

const handleRequired = handleFound

const handleOptional = <R>(result: Effect<void, FetchReferenceNotFoundError, R>) =>
	pipe(
		result,
		handleFound,
		effectCatchTag(FETCH_REFERENCE_NOT_FOUND_ERROR_TAG, () =>
			pipe(effectLogWarning("Failed to fetch one or more optional refs"), effectAs(NotFound))
		)
	)

/**
 * Fetches refs the remote repository.
 * @param props - Props object
 * @param props.repoDir - Directory of the repository
 * @param props.fetchRefs - Fetch references
 * @param props.fetchRefs.refs - References to fetch
 * @param props.fetchRefs.remote - Remote repository to fetch from
 * @param props.depth - Depth of the fetch
 * @param props.deepen - Whether to deepen the fetch
 * @returns - A promise that resolves when the fetch is complete
 */
const fetchReferences = ({
	fetchRefs: { refs, remote = DEFAULT_REMOTE },
	repoDir,
	depth = DEFAULT_DEPTH,
	deepen = false,
}: Arguments): Effect<WasFound, FetchReferenceNotFoundError, FetchCommand | PrintRefs> =>
	effectGen(function* () {
		const [fetchCommand, printRefs] = yield* effectAll([FetchCommand, PrintRefs], {
			concurrency: "unbounded",
		})

		const doFetch =
			<E>(
				commandHandler: (
					result: Effect<void, FetchReferenceNotFoundError>
				) => Effect<boolean, E>
			) =>
			(references: NonEmptyReadonlyArray<Reference>) =>
				pipe(
					fetchCommand({
						repoDir,
						depth,
						deepen,
						refSpecs: {
							remote,
							refs: references,
						},
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
			printRefs({ repoDirectory: repoDir, level: "Debug", message: "Refs pre fetch" }),
			effectAndThen(
				effectReduce(sequence, Found, (accumulator, effect) =>
					pipe(
						effect,
						effectMap((result) => result && accumulator)
					)
				)
			),
			effectTap(
				printRefs({ repoDirectory: repoDir, level: "Debug", message: "Refs post fetch" })
			)
		)
	})

export default fetchReferences
export type { Arguments }
