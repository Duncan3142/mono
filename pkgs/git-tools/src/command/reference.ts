import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import { pipe } from "effect/Function"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	fail as effectFail,
	either as effectEither,
} from "effect/Effect"
import {
	value as matchValue,
	when as matchWhen,
	orElse as matchOrElse,
	exhaustive as matchExhaustive,
} from "effect/Match"
import { match as eitherMatch } from "effect/Either"
import {
	make as commandMake,
	exitCode as commandExitCode,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import { BRANCH, LogReferencesError, TAG, type REF_TYPE } from "#domain/reference"

const SUCCESS_CODE = 0

interface Arguments {
	repoDirectory: string
	type: REF_TYPE
}

const commandFail = () => effectFail(new LogReferencesError())

/**
 * Lists the references (branches or tags) in a git repository.
 * @param args - The arguments for the command
 * @param args.repoDirectory - The directory of the repository
 * @param args.type - The type of references to list (branch or tag)
 * @returns An Effect that executes the git command to list references
 */
const command = ({
	repoDirectory,
	type,
}: Arguments): Effect<void, LogReferencesError, CommandExecutor> => {
	const args = pipe(
		matchValue(type),
		matchWhen(BRANCH, () => ["branch", "-a", "-v", "-v"]),
		matchWhen(TAG, () => ["tag"]),
		matchExhaustive
	)
	return pipe(
		commandMake("git", "--no-pager", ...args),
		commandWorkDir(repoDirectory),
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
						matchWhen(SUCCESS_CODE, () => effectVoid),
						matchOrElse(commandFail)
					),
			})
		)
	)
}
export default command
