import type { NonEmptyReadonlyArray } from "effect/Array"
import { make, exitCode, stdout, workingDirectory } from "@effect/platform/Command"
import { type Effect, gen, logInfo, logWarning, logError, fail } from "effect/Effect"
import type { PlatformError } from "@effect/platform/Error"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import { FetchNotFoundError, type WasFound, Found, NotFound } from "#domain/fetch"
import { BASE_10_RADIX } from "#config/consts"

interface FetchProperties {
	readonly repoDir: string
	readonly optional: boolean
	readonly remote: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: NonEmptyReadonlyArray<string>
}

/**
 * Fetches the specified ref specs from the remote repository
 * @param props - The properties for the fetch operation
 * @param props.repoDir - The directory of the repository
 * @param props.optional - Whether the fetch is optional
 * @param props.remote - The remote repository to fetch from
 * @param props.depth - The depth of the fetch operation
 * @param props.deepen - Whether to deepen the fetch
 * @param props.refSpecs - The ref specs to fetch
 * @returns An Effect that resolves to Found, FetchError, or FetchNotFoundError
 */
const fetch = ({
	repoDir,
	optional,
	remote,
	depth,
	deepen,
	refSpecs,
}: FetchProperties): Effect<WasFound, FetchNotFoundError | PlatformError, CommandExecutor> =>
	gen(function* () {
		const depthString = depth.toString(BASE_10_RADIX)

		const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

		const FETCH_SUCCESS_CODE = 0
		const FETCH_NOT_FOUND_CODE = 128

		yield* logInfo(`Fetching ref specs "${refSpecs.join(", ")}"`)

		const command = make("git", "fetch", depthArgument, remote, ...refSpecs).pipe(
			workingDirectory(repoDir),
			stdout("inherit"),
			exitCode
		)

		const code = yield* command

		switch (true) {
			case code === FETCH_SUCCESS_CODE: {
				return Found
			}
			case code === FETCH_NOT_FOUND_CODE && optional: {
				yield* logWarning("Optional refs fetch failed")
				return NotFound
			}
			default: {
				yield* logError("Fetch failed")
				return yield* fail(new FetchNotFoundError())
			}
		}
	})

export default fetch
