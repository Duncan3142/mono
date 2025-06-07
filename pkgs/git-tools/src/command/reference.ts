import type { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import { pipe } from "effect/Function"
import type { Effect } from "effect/Effect"
import { make, exitCode, stdout, workingDirectory, stderr } from "@effect/platform/Command"
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
		make("git", "--no-pager", ...args),
		workingDirectory(repoDirectory),
		stdout("inherit"),
		stderr("inherit"),
		exitCode
	)
}

export { command, SUCCESS_CODE }
