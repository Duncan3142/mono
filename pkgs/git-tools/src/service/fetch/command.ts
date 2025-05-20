import type { NonEmptyReadonlyArray } from "effect/Array"
import { make, exitCode, stdout, workingDirectory, stderr } from "@effect/platform/Command"
import {
	type Effect,
	logInfo,
	logWarning,
	andThen,
	succeed,
	as,
	flatMap,
	logError,
	fail,
} from "effect/Effect"
import { pipe } from "effect"
import type { PlatformError } from "@effect/platform/Error"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import { FetchNotFoundError, type WasFound, Found, NotFound } from "#domain/fetch"
import { BASE_10_RADIX } from "#config/consts"

const EXPECTED = "expected"
const OPTIONAL = "optional"

/**
 * Type of the ref spec - expected or optional
 */
type Contingent = typeof EXPECTED | typeof OPTIONAL

interface ContingentReferenceSpecs<Type extends Contingent> {
	type: Type
	refs: NonEmptyReadonlyArray<string>
}

interface FetchProperties {
	readonly repoDir: string
	readonly remote: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: ContingentReferenceSpecs<Contingent>
}

/**
 * Fetches the specified ref specs from the remote repository
 * @param props - The properties for the fetch operation
 * @param props.repoDir - The directory of the repository
 * @param props.remote - The remote repository to fetch from
 * @param props.depth - The depth of the fetch operation
 * @param props.deepen - Whether to deepen the fetch
 * @param props.refSpecs - The ref specs to fetch
 * @returns An Effect that resolves to Found, FetchError, or FetchNotFoundError
 */
const fetch = ({
	repoDir,
	remote,
	depth,
	deepen,
	refSpecs,
}: FetchProperties): Effect<WasFound, FetchNotFoundError | PlatformError, CommandExecutor> => {
	const { type, refs } = refSpecs
	const optional = type === OPTIONAL
	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	const FETCH_SUCCESS_CODE = 0
	const FETCH_NOT_FOUND_CODE = 128

	return pipe(
		logInfo(`Fetching ref specs "${refs.join(", ")}"`),
		andThen(
			pipe(
				make("git", "fetch", depthArgument, remote, ...refs),
				workingDirectory(repoDir),
				stdout("inherit"),
				stderr("inherit"),
				exitCode
			)
		),
		flatMap((code) => {
			switch (true) {
				case code === FETCH_SUCCESS_CODE: {
					return succeed(Found)
				}
				case code === FETCH_NOT_FOUND_CODE && optional: {
					return pipe(logWarning("Failed to fetch one or more optional refs"), as(NotFound))
				}
				default: {
					return pipe(
						logError("Fetch failed"),
						flatMap(() => fail(new FetchNotFoundError()))
					)
				}
			}
		})
	)
}

export default fetch
export { EXPECTED, OPTIONAL }
export type { Contingent, FetchProperties, ContingentReferenceSpecs }
