import {
	type Effect,
	tap,
	andThen,
	reduce,
	map,
	logWarning,
	succeed,
	logError,
	flatMap,
	fail,
	as,
} from "effect/Effect"

import { filterMap, toEntries } from "effect/Record"
import { some, none } from "effect/Option"
import { type NonEmptyReadonlyArray, groupBy, sortBy, map as arrayMap } from "effect/Array"
import { pipe } from "effect"
import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import type { UnknownException } from "effect/Cause"
import { mapInput, string } from "effect/Order"
import command, { FETCH_NOT_FOUND_CODE, FETCH_SUCCESS_CODE } from "./fetch/command.ts"
import logReferences from "#service/reference"
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
		logError("Fetch failed"),
		flatMap(() => fail(new FetchNotFoundError()))
	)

const handleRequired = flatMap((code: ExitCode) => {
	switch (true) {
		case code === FETCH_SUCCESS_CODE: {
			return succeed(Found)
		}
		default: {
			return fetchFailed()
		}
	}
})

const handleOptional = flatMap((code: ExitCode) => {
	switch (true) {
		case code === FETCH_SUCCESS_CODE: {
			return succeed(Found)
		}
		case code === FETCH_NOT_FOUND_CODE: {
			return pipe(logWarning("Failed to fetch one or more optional refs"), as(NotFound))
		}
		default: {
			return fetchFailed()
		}
	}
})

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
	FetchNotFoundError | LogReferencesError | PlatformError | UnknownException,
	CommandExecutor
> => {
	const doFetch = (references: NonEmptyReadonlyArray<Reference>) =>
		command({
			repoDir,
			depth,
			deepen,
			refSpecs: {
				remote,
				refs: references,
			},
		})

	const sequence = pipe(
		refs,
		groupBy(optionalString),
		filterMap((value, key) => {
			switch (key) {
				case REQUIRED: {
					return some(pipe(doFetch(value), handleRequired))
				}
				case OPTIONAL: {
					return some(pipe(doFetch(value), handleOptional))
				}
				default: {
					return none()
				}
			}
		}),
		toEntries,
		sortBy(mapInput(string, ([key]) => key)),
		arrayMap(([_, effect]) => effect)
	)

	return pipe(
		logReferences({ repoDirectory: repoDir, level: "Debug", message: "Refs pre fetch" }),
		andThen(
			reduce(sequence, Found, (accumulator, effect) =>
				pipe(
					effect,
					map((result) => result && accumulator)
				)
			)
		),
		tap(logReferences({ repoDirectory: repoDir, level: "Debug", message: "Refs post fetch" }))
	)
}

export default fetchReferences
