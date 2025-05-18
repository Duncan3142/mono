import type { NonEmptyReadonlyArray } from "effect/Array"
import type { Effect } from "effect/Effect"
import type { FetchError, FetchNotFoundError, Found } from "#domain/fetch"
import { BASE_10_RADIX } from "#config/consts"

interface FetchProperties {
	readonly optional: boolean
	readonly remote: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: NonEmptyReadonlyArray<string>
}

/**
 * Fetches the specified ref specs from the remote repository
 * @param props - The properties for the fetch operation
 * @param props.optional - Whether the fetch is optional
 * @param props.remote - The remote repository to fetch from
 * @param props.depth - The depth of the fetch operation
 * @param props.deepen - Whether to deepen the fetch
 * @param props.refSpecs - The ref specs to fetch
 * @returns An Effect that resolves to Found, FetchError, or FetchNotFoundError
 */
const fetch = async ({
	optional,
	remote,
	depth,
	deepen,
	refSpecs,
}: FetchProperties): Effect<Found, FetchError | FetchNotFoundError> => {
	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	const FETCH_SUCCESS_CODE = 0
	const FETCH_ERROR_CODE = 128

	logInfo('Fetching ref specs "%s"', refSpecs.join(", "))

	const command = makeCommand("git", "fetch", depthArgument, remote, ...refSpecs)

	switch (true) {
		case exitCode === FETCH_SUCCESS_CODE: {
			return FETCH_RESULT.FOUND
		}
		case exitCode === FETCH_ERROR_CODE && optional: {
			pino.warn("Optional refs fetch failed")
			return FETCH_RESULT.NOT_FOUND
		}
		default: {
			pino.error("Fetch failed")
			return FETCH_RESULT.ERROR
		}
	}
}

export default fetch
