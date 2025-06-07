import {
	type Effect,
	tap as effectTap,
	andThen as effectAndThen,
	reduce as effectReduce,
	map as effectMap,
	logWarning as effectLogWarning,
	succeed as effectSucceed,
	logError as effectLogError,
	flatMap as effectFlatMap,
	fail as effectFail,
	as as effectAs,
} from "effect/Effect"
import { filterMap as recordFilterMap, toEntries as recordToEntries } from "effect/Record"
import {
	value as matchValue,
	when as matchWhen,
	orElse as matchOrElse,
	option as matchOption,
} from "effect/Match"
import {
	type NonEmptyReadonlyArray,
	groupBy as arrayGroupBy,
	sortBy as arraySortBy,
	map as arrayMap,
} from "effect/Array"
import { pipe } from "effect/Function"
import { either as effectEither } from "effect/Effect"
import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import type { UnknownException } from "effect/Cause"
import { match as eitherMatch } from "effect/Either"
import { mapInput as orderMapInput, string as orderString } from "effect/Order"
import fetchCommand, { FETCH_NOT_FOUND_CODE, FETCH_SUCCESS_CODE } from "#command/fetch"
import referenceLog from "#service/reference"
import { DEFAULT_DEPTH, DEFAULT_REMOTE } from "#config/consts"
import {
	FetchNotFoundError,
	Found,
	type WasFound,
	NotFound,
	optionalString,
	REQUIRED,
	OPTIONAL,
	type FetchReferences,
	FetchFailedError,
} from "#domain/fetch"
import type { LogReferencesError, Reference } from "#domain/reference"

interface Arguments {
	fetchRefs: FetchReferences
	repoDir: string
	depth?: number
	deepen?: boolean
}

const fetchFailed = () =>
	pipe(
		effectLogError("Fetch failed"),
		effectFlatMap(() => effectFail(new FetchFailedError()))
	)

const handleExitCode =
	<A, E, R>(handleNotFound: () => Effect<A, E, R>) =>
	(code: ExitCode) =>
		pipe(
			matchValue(code),
			matchWhen(FETCH_SUCCESS_CODE, () => effectSucceed(Found)),
			matchWhen(FETCH_NOT_FOUND_CODE, handleNotFound),
			matchOrElse(() => fetchFailed())
		)

const handleRequired = handleExitCode(() => effectFail(new FetchNotFoundError()))

const handleOptional = handleExitCode(() =>
	pipe(effectLogWarning("Failed to fetch one or more optional refs"), effectAs(NotFound))
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
}: Arguments): Effect<
	WasFound,
	FetchNotFoundError | FetchFailedError | LogReferencesError | PlatformError | UnknownException,
	CommandExecutor
> => {
	const doFetch =
		<E>(codeHandler: (code: ExitCode) => Effect<WasFound, FetchFailedError | E>) =>
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
				effectFlatMap(codeHandler),
				effectEither,
				effectFlatMap(
					eitherMatch({
						onLeft: (error) => effectFail(error),
						onRight: (found) => effectSucceed(found),
					})
				)
			)

	const fetchRequired = doFetch(handleRequired)

	const fetchOptional = doFetch(handleOptional)

	const sequence = pipe(
		refs,
		arrayGroupBy(optionalString),
		recordFilterMap((fetchRefs, key) =>
			pipe(
				matchValue(key),
				matchWhen(REQUIRED, () => fetchRequired(fetchRefs)),
				matchWhen(OPTIONAL, () => fetchOptional(fetchRefs)),
				matchOption
			)
		),
		recordToEntries,
		arraySortBy(orderMapInput(orderString, ([key]) => key)),
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
