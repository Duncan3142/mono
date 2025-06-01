import { make, exitCode, stdout, workingDirectory, stderr } from "@effect/platform/Command"
import { type Effect, logInfo, andThen } from "effect/Effect"
import { pipe } from "effect"
import type { PlatformError } from "@effect/platform/Error"
import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import { BASE_10_RADIX } from "#config/consts"
import { toStrings, type ReferenceSpecs } from "#domain/reference-spec"

interface Arguments {
	readonly repoDir: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: ReferenceSpecs
}

const FETCH_SUCCESS_CODE = 0
const FETCH_NOT_FOUND_CODE = 128

/**
 * Fetches the specified ref specs from the remote repository
 * @param props - The properties for the fetch operation
 * @param props.repoDir - The directory of the repository
 * @param props.depth - The depth of the fetch operation
 * @param props.deepen - Whether to deepen the fetch
 * @param props.refSpecs - The ref specs to fetch
 * @returns An Effect that resolves to Found, FetchError, or FetchNotFoundError
 */
const command = ({
	repoDir,
	depth,
	deepen,
	refSpecs,
}: Arguments): Effect<ExitCode, PlatformError, CommandExecutor> => {
	const { remote, refs } = toStrings(refSpecs)

	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

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
		)
	)
}

export default command
export { FETCH_SUCCESS_CODE, FETCH_NOT_FOUND_CODE }
export type { Arguments }
