import {
	make as commandMake,
	exitCode as commandExitCode,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	fail as effectFail,
	either as effectEither,
} from "effect/Effect"
import { pipe } from "effect/Function"
import { match as eitherMatch } from "effect/Either"
import { value as matchValue, when as matchWhen, orElse as matchOrElse } from "effect/Match"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import { BASE_10_RADIX } from "#config/consts"
import { toStrings as refSpecToStrings, type ReferenceSpecs } from "#domain/reference-spec"
import { FetchFailedError, FetchNotFoundError } from "#domain/fetch"

interface Arguments {
	readonly repoDir: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: ReferenceSpecs
}

const FETCH_SUCCESS_CODE = 0
const FETCH_NOT_FOUND_CODE = 128

const commandFail = () => effectFail(new FetchFailedError())

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
}: Arguments): Effect<void, FetchFailedError | FetchNotFoundError, CommandExecutor> => {
	const { remote, refs } = refSpecToStrings(refSpecs)

	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	return pipe(
		commandMake("git", "fetch", depthArgument, remote, ...refs),
		commandWorkDir(repoDir),
		commandStdout("inherit"),
		commandStderr("inherit"),
		commandExitCode,
		effectEither,
		effectFlatMap(
			eitherMatch({
				onLeft: commandFail,
				onRight: (code) =>
					pipe(
						matchValue(code),
						matchWhen(FETCH_SUCCESS_CODE, () => effectVoid),
						matchWhen(FETCH_NOT_FOUND_CODE, () => effectFail(new FetchNotFoundError())),
						matchOrElse(() => commandFail())
					),
			})
		)
	)
}

export default command
export type { Arguments }
