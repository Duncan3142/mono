import { make, exitCode, stdout, workingDirectory, stderr } from "@effect/platform/Command"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import {
	type Effect,
	all,
	fail,
	flatMap,
	void as asVoid,
	whenLogLevel,
	logWithLevel,
} from "effect/Effect"
import { pipe } from "effect"
import { fromLiteral, type Literal as LogLevel } from "effect/LogLevel"
import { LogReferencesError } from "#domain/reference"

interface Arguments {
	level: LogLevel
	message: string
	repoDirectory: string
}

interface ExecArguments {
	repoDirectory: string
	args: ReadonlyArray<string>
}

const SUCCESS_CODE = 0

const exec = ({
	args,
	repoDirectory,
}: ExecArguments): Effect<void, PlatformError | LogReferencesError, CommandExecutor> =>
	pipe(
		make("git", "--no-pager", ...args),
		workingDirectory(repoDirectory),
		stdout("inherit"),
		stderr("inherit"),
		exitCode,
		flatMap((code) => (code === SUCCESS_CODE ? asVoid : fail(new LogReferencesError())))
	)

/**
 * Prints the refs of the current git repository.
 * @param args - Context object
 * @param args.repoDirectory - Repo directory
 * @param args.level - Log level
 * @param args.message - Log message header
 * @returns - A promise that resolves when the refs are printed
 */
const logReferences = ({
	message,
	repoDirectory,
	level,
}: Arguments): Effect<void, PlatformError | LogReferencesError, CommandExecutor> =>
	pipe(
		all(
			[
				logWithLevel(fromLiteral(level), message),
				exec({ repoDirectory, args: ["branch", "-a", "-v", "-v"] }),
				exec({ repoDirectory, args: ["tag"] }),
			],
			{
				discard: true,
			}
		),
		whenLogLevel(level)
	)

export default logReferences
