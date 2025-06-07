import {
	make as commandMake,
	exitCode as commandExitCode,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import { type Effect, logInfo as effectLogInfo, andThen as effectAndThen } from "effect/Effect"
import { pipe } from "effect/Function"
import type { PlatformError } from "@effect/platform/Error"
import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import { BASE_10_RADIX } from "#config/consts"
import { toStrings as refSpecToStrings, type ReferenceSpecs } from "#domain/reference-spec"

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
	const { remote, refs } = refSpecToStrings(refSpecs)

	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	return pipe(
		effectLogInfo(`Fetching ref specs "${refs.join(", ")}"`),
		effectAndThen(
			pipe(
				commandMake("git", "fetch", depthArgument, remote, ...refs),
				commandWorkDir(repoDir),
				commandStdout("inherit"),
				commandStderr("inherit"),
				commandExitCode
			)
		)
	)
}

export default command
export { FETCH_SUCCESS_CODE, FETCH_NOT_FOUND_CODE }
export type { Arguments }
