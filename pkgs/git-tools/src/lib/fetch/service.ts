import {
	type Effect,
	tap as effectTap,
	andThen as effectAndThen,
	reduce as effectReduce,
	map as effectMap,
	logWarning as effectLogWarning,
	as as effectAs,
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
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import { mapInput as orderMapInput, number as orderNumber } from "effect/Order"
import {
	type FetchReferences,
	type FetchNotFoundError,
	Found,
	type WasFound,
	NotFound,
	optionalString,
	REQUIRED,
	OPTIONAL,
	OPTIONALITY_ORDER_MAP,
	FETCH_NOT_FOUND_ERROR_TAG,
} from "./domain.js"
import fetchCommand from "./command.js"
import { DEFAULT_DEPTH } from "./const.js"
import { DEFAULT_REMOTE } from "#remote/const"
import referenceLog from "#reference/service"
import type { Reference } from "#reference/domain"

interface Arguments {
	fetchRefs: FetchReferences
	repoDir: string
	depth?: number
	deepen?: boolean
}

const handleFound = effectAs(Found)

const handleRequired = handleFound

const handleOptional = (result: Effect<void, FetchNotFoundError, CommandExecutor>) =>
	pipe(
		result,
		handleFound,
		effectCatchTag(FETCH_NOT_FOUND_ERROR_TAG, () =>
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
}: Arguments): Effect<WasFound, FetchNotFoundError, CommandExecutor> => {
	const doFetch =
		<E>(
			commandHandler: (
				result: Effect<void, FetchNotFoundError, CommandExecutor>
			) => Effect<boolean, E, CommandExecutor>
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
	return pipe(
		referenceLog({ repoDirectory: repoDir, level: "Debug", message: "Refs pre fetch" }),
		effectAndThen(
			effectReduce(sequence, Found, (accumulator, effect) =>
				pipe(
					effect,
					effectMap((result) => result && accumulator)
				)
			)
		),
		effectTap(
			referenceLog({ repoDirectory: repoDir, level: "Debug", message: "Refs post fetch" })
		)
	)
}

export default fetchReferences
