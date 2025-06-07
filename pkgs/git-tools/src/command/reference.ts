import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import { pipe } from "effect/Function"
import type { Effect } from "effect/Effect"
import {
	make as commandMake,
	exitCode as commandExitCode,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import type { LogReferencesError, REF_TYPE } from "#domain/reference"

const SUCCESS_CODE = 0

interface Arguments {
	repoDirectory: string
	type: REF_TYPE
}

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
}: Arguments): Effect<ExitCode, PlatformError | LogReferencesError, CommandExecutor> => {
	const args = type === "branch" ? ["branch", "-a", "-v", "-v"] : ["tag"]
	return pipe(
		commandMake("git", "--no-pager", ...args),
		commandWorkDir(repoDirectory),
		commandStdout("inherit"),
		commandStderr("inherit"),
		commandExitCode
	)
}
export default command
export { SUCCESS_CODE }
